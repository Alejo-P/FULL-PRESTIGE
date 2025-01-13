document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('select-ruta').addEventListener('change', onChangeRuta);

    document.getElementById('select-estado').addEventListener('change', onChangeEstado);

    document.getElementById('select-endpoint').addEventListener('change', onChangeEndpoint);

    document.getElementById('select-metodo').addEventListener('change', onChangeMetodo);

});

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function openModal(nombre, ruta, endpoint, http_status, res_body) {
    let modal = document.getElementById('modal');
    let textArea = document.getElementById('iframe');
    let titleModal = document.getElementById('modal-title');
    let rowRuta = document.getElementById('modal-ruta');
    let rowEstado = document.getElementById('modal-http-status');
    let rowEndpoint = document.getElementById('modal-endpoint');

    console.log("Respuesta: " + res_body);
    console.log("Tamaño del textarea: " + textArea.scrollHeight);

    // Obtener los valores de la respuesta
    titleModal.innerText = nombre;
    rowRuta.innerText = ruta;
    rowEstado.innerText = http_status;
    rowEndpoint.innerText = endpoint;

    // Mostrar la respuesta en el textarea
    textArea.value = res_body;
    textArea.readOnly = true;

    // Ajustar la altura del textarea
    textArea.style.height = "auto";
    textArea.style.height = textArea.scrollHeight + "px";

    console.log("Tamaño del textarea: " + textArea.scrollHeight);

    // Redimensionar el iframe
    //adjustTextAreaHeight(textArea); // Ajustar la altura automáticamente
    modal.style.display = "flex";

    // Cerrar el modal al hacer clic fuera de él
    window.onclick = function(event) {
        if (event.target === document.getElementById('modal')) {
            closeModal();
        }
    };
}

function adjustTextAreaHeight(textArea) {
    textArea.style.height = "auto"; // Restablecer para calcular el scrollHeight
    textArea.style.height = textArea.scrollHeight + "px"; // Ajustar al contenido
}

function onChangeRuta() {
    let select = document.getElementById('select-ruta');
    let value = select.options[select.selectedIndex].value;
    let rows = document.querySelectorAll('tr');

    rows.forEach(row => {
        if (row.id === 'header' || row.id === 'total' || row.id === 'detail') return;

        if (value === 'all') {
            row.style.display = '';
        } else {
            row.style.display = row.children[2].textContent === value ? '' : 'none';
        }
    });
}

function onChangeEstado() {
    let select = document.getElementById('select-estado');
    let value = select.options[select.selectedIndex].value;
    let rows = document.querySelectorAll('tr');

    rows.forEach(row => {
        if (row.id === 'header' || row.id === 'total' || row.id === 'detail') return

        if (value === 'all') {
            row.style.display = '';
        } else {
            row.style.display = row.children[0].textContent === '✔' ? value === 'passed' ? '' : 'none' : row.children[0].textContent === '❌' ? value === 'failed' ? '' : 'none' : value === 'unknown' ? '' : 'none';
        }
    });
}

function onChangeEndpoint() {
    let select = document.getElementById('select-endpoint');
    let value = select.options[select.selectedIndex].value;
    let rows = document.querySelectorAll('tr');

    rows.forEach(row => {
        if (row.id === 'header' || row.id === 'total' || row.id === 'detail') return

        if (value === 'all') {
            row.style.display = '';
        } else {
            row.style.display = row.children[3].textContent.includes(value) ? '' : 'none';
        }
    });
}

function onChangeMetodo() {
    let select = document.getElementById('select-metodo');
    let value = select.options[select.selectedIndex].value;
    let rows = document.querySelectorAll('tr');

    rows.forEach(row => {
        if (row.id === 'header' || row.id === 'total' || row.id === 'detail') return

        if (value === 'all') {
            row.style.display = '';
        } else {
            row.style.display = row.children[3].textContent.includes(value) ? '' : 'none';
        }
    });
}