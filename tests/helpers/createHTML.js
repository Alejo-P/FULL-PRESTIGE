import fs from 'fs';

export const generateHTML = (logs, file) => {
    const rutas = [...new Set(logs.map(log => log.ruta))];
    const estados = [...new Set(logs.map(log => log.estado))];
    const endpoints = [...new Set(logs.map(log => {
        const [method, url] = log.endpoint.split(" "); // Divide en METHOD y URL
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.pathname; // Retorna solo el path
        } catch (e) {
            return null; // Retorna null si la URL no es válida
        }
    }))];
    const metodos = [...new Set(logs.map(log => {
        const [method, url] = log.endpoint.split(" "); // Divide en METHOD y URL
        return method; // Retorna solo el método
    }))];
    // Crear la estructura HTML para mostrar los resultados de las pruebas
    let html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados de las pruebas</title>
    <script src="./handler.js"></script>
</head>
<body>`;

    // Iterar sobre los logs y agregarlos a una tabla HTML
    html += `
    <header>
        <h1>Resultados de las pruebas unitarias</h1>
    </header>
    <div class="filters">
        <div class="filter">
            <h3>Filtrar por ruta</h3>
            <select id="select-ruta" onchange="onChangeRuta()">
                <option value="all">Todas</option>
                ${rutas.map(ruta => `<option value="${ruta}">${ruta}</option>`).join('')}
            </select>
        </div>

        <div class="filter">
            <h3>Filtrar por endpoint</h3>
            <select id="select-endpoint" onchange="onChangeEndpoint()">
                <option value="all">Todos</option>
                ${endpoints.map(endpoint => `<option value="${endpoint}">${endpoint}</option>`).join('')}
            </select>
        </div>

        <div class="filter">
            <h3>Filtrar por método</h3>
            <select id="select-metodo" onchange="onChangeMetodo()">
                <option value="all">Todos</option>
                ${metodos.map(metodo => `<option value="${metodo}">${metodo}</option>`).join('')}
            </select>
        </div>

        <div class="filter">
            <h3>Filtrar por estado</h3>
            <select id="select-estado" onchange="onChangeEstado()">
                <option value="all">Todos</option>
                ${estados.map(estado => `<option value="${estado}">${estado}</option>`).join('')}
            </select>
        </div>
    </div>

    <hr/>
    <h2>Total de pruebas</h2>
    <table style="width: 50%; margin: 0 auto;">
        <thead>
            <tr id="header">
                <th>Total de pruebas</th>
                <th>Pruebas con exito</th>
                <th>Pruebas fallidas</th>
                <th>Pruebas desconocidas</th>
                <th>Endpoints probados</th>
            </tr>
        </thead>

        <tbody>
            <tr id="total">
                <td class="${logs.filter(log => log.estado === 'passed').length === logs.length ? 'success' : 'failure'}">
                    ${logs.length}
                </td>
                <td class="${logs.filter(log => log.estado === 'passed').length === logs.length ? 'success' : 'failure'}">
                    ${logs.filter(log => log.estado === 'passed').length}
                </td>
                <td class="${logs.filter(log => log.estado === 'failed').length > 0 ? 'failure' : 'success'}">
                    ${logs.filter(log => log.estado === 'failed').length}
                </td>
                <td class="${logs.filter(log => log.estado === 'unknown').length > 0 ? 'unknown' : 'success'}">
                    ${logs.filter(log => log.estado === 'unknown').length}
                </td>
                <td class="${endpoints.length === logs.filter(log => log.estado === 'passed').length ? 'success' : 'failure'}">
                    ${endpoints.length}
                </td>
            </tr>
        </tbody>
    </table>
    <hr/>

    <h2>Resumen</h2>
    <table>
        <thead>
            <tr id="header">
                <th>Estado</th>
                <th>Nombre</th>
                <th>Ruta</th>
                <th>Endpoint</th>
                <th>HTTP Status</th>
            </tr>
        </thead>
        <tbody>`;

    logs.forEach(log => {
        const resultado = {
            req_body: log.request_data,
            res_body: log.resultado,
        }

        const resultadoEscapado = JSON.stringify(resultado, null, 4)
            .replace(/"/g, '&quot;')  // Escapar comillas dobles
            .replace(/'/g, '&#39;')  // Escapar comillas simples
            .replace(/\n/g, '\\n');  // Escapar saltos de línea

        // Escribir los resultados de las pruebas en el archivo HTML
        html += `
        <tr class="${log.estado === 'passed' ? 'success' : log.estado === 'failed' ? 'failure' : 'unknown'}" onclick="openModal('${log.nombre} - ${log.estado}', '${log.ruta}', '${log.endpoint}', '${log.http_status}', '${resultadoEscapado}' )">
            <td>${log.estado === 'passed' ? "✔" : log.estado === 'failed' ? "❌" : "❔"}</td>
            <td>${log.nombre}</td>
            <td>${log.ruta}</td>
            <td>${log.endpoint}</td>
            <td>${log.http_status}</td>
        </tr>
        `;
    });

    html += `
        </tbody>
    </table>

    <div class="modal" id="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h3 id="modal-title"></h3>
            <table>
                <thead>
                    <tr id="header">
                        <th>Ruta</th>
                        <th>Endpoint</th>
                        <th>HTTP Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr id="detail">
                        <td id="modal-ruta"></td>
                        <td id="modal-endpoint"></td>
                        <td id="modal-http-status"></td>
                    </tr>
                </tbody>
            </table>
            <textarea id="iframe" class="text-result"></textarea>
        </div>
    </div>

    <style>
        .filters{
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-direction: row;
            margin-bottom: 16px;
            padding: 5px;
        }

        .filter {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000000;
            margin: 0 auto;
        }

        th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #000000;
            border-right: 1px solid #000000;
            text-align: center;
        }

        th {
            background-color: #f2f2f2;
        }

        tr:hover {
            background-color: #f2f2f2;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }

        h1, h2 {
            text-align: center;
        }

        .success {
            background-color: lightgreen;
        }

        .failure {
            background-color: lightcoral;
        }

        .unknown {
            background-color: lightgray;
        }

        a:hover {
            text-decoration: underline;
        }

        .modal {
            display: none;
            justify-content: center; /* Centrado horizontal */
            align-items: center; /* Centrado vertical */
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
        }

        .text-result {
            width: 95%;
            min-height: 55%;
            margin-top: 10px;
            resize: none; /* Deshabilitar el redimensionamiento manual */
            border: none;
            font-family: monospace;
            overflow-y: auto; /* Permitir desplazamiento vertical */
        }

        .modal-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #fefefe;
            margin: 15% auto;
            padding: 15px;
            border: 1px solid #888;
            width: 70%; /* Ancho del modal */
            height: 65%;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
            border-radius: 10px;
            overflow: auto; /* Desplazamiento si el contenido excede */
        }

        .close {
            display: flex;
            align-self: flex-end;
            color: #aaa;
            font-size: 25px;
            font-weight: bold;
        }

        .close:hover, .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
    </style>
</body>
</html>`;

    // Guardar el HTML en un archivo
    fs.writeFileSync(file, html, 'utf8');
};