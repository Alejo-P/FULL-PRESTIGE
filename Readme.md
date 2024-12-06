<h1>Full Prestige - API (Backend)</h1>
<p>
    API desarrollada con Express y Node.js para la gestión de infromación de
    un taller automotriz <code>Full Prestige</code>
</p>

<h1>Tabla de contenidos</h1>

<ul>
    <li><a href="#descripción">Descripción</a></li>
    <li><a href="#características">Características</a></li>
    <li><a href="#requisitos-previos">Requisitos Previos</a></li>
    <li><a href="#instalación">Instalación</a></li>
    <li><a href="#uso">Uso</a></li>
    <li><a href="#estructura-del-proyecto">Estructura del Proyecto</a></li>
    <li><a href="#pruebas">Pruebas</a></li>
    <li><a href="#contribuciones">Contribuciones</a></li>
</ul>

<h1 id="descripción">Descripción</h1>
<p>
    API que permite la gestión de la información que se maneja en el taller,
    como lo son los clientes, vehículos que ingresan, empleados presentes, y
    controles, almacenandolos en una base de datos MongoDB.
</p>

<h1 id="características">Características</h1>
<ul>
    <li>Autorizacion basada en roles</li>
    <li>Autenticacion basada en JWT</li>
    <li>Registro y actualización de empleado con distinto cargos</li>
    <li>Registro y control de asistencia a cada uno de los empleados</li>
    <li>Registro y actualización de clientes y sus respectivos vehiculos</li>
    <li>Registro y actualización de mantenimientos a vehiculos</li>
    <li>Asignacion de cada mantenimiento a empleados con cargo
    Técnico</li>
</ul>

<h1 id="requisitos-previos">Requisitos Previos</h1>
<ul>
    <li>Node.js >= 20.x</li>
    <li>npm</li>
    <li>Mongoose >= 8.x</li>
    <li>Express >= 5.0</li>
    <li>JWT >= 9.0.x</li>
    <li>bcrypt >= 5.x</li>
    <li>dotenv >= 16.4.x</li>
    <li>cors >= 2.8.x</li>
    <li>nodemon = 3.1.7</li>
</ul>

<h1 id="instalación">Instalación</h1>
<p>
    Para instalar el proyecto, se debe clonar el repositorio y ejecutar el
    siguiente comando en la raíz del proyecto:
</p>
<pre><code>git clone https://github.com/Alejo-P/FULL-PRESTIGE.git
cd FULL-PRESTIGE</code></pre>

<p>
    Luego, se debe instalar las dependencias del proyecto con el siguiente
    comando:
</p>
<pre><code>npm install</code></pre>

<p>
    Por último, se debe crear un archivo <code>.env</code> en la raíz del
    proyecto basado en el archivo <code>.env.example</code> y configurar las
    variables de entorno necesarias.
</p>
<pre><code>opy .env.example .env</code></pre>

<h1 id="uso">Uso</h1>

<p>
    Para ejecutar el proyecto, se debe ejecutar el siguiente comando en la
    raíz del proyecto: (para desarrollo)
</p>
<pre><code>npm run dev</code></pre>

<p>
    Para ejecutar el proyecto en producción, se debe ejecutar el siguiente
    comando en la raíz del proyecto:
</p>
<pre><code>npm start</code></pre>

<p>
    La API sera accesible en la siguiente ruta (para desarrollo):
</p>
<pre><code>http://localhost:3000/api/v1</code></pre>

<h1 id="estructura-del-proyecto">Estructura del Proyecto</h1>

<pre>
.
├── assets
│   └── logo.jpg
├── src
│   ├── config
│   │   └── nodeMailer.js
│   ├── controllers
│   │   ├── AsistenciasController.js
│   │   ├── ClientesController.js
│   │   ├── EmpleadosController.js
│   │   ├── MantenimientosController.js
│   │   ├── PagosController.js
│   │   └── VehiculosController.js
│   ├── helpers
│   │   └── JWT.js
│   ├── middlewares
│   │   ├── auth.js
│   │   ├── validacionAsistencia.js
│   │   ├── validacionClientes.js
│   │   ├── validacionEmpleado.js
│   │   ├── validacionMantenimientos.js
│   │   ├── validacionPagos.js
│   │   └── validacionVehiculos.js
│   ├── models
│   │   ├── AsistenciasModel.js
│   │   ├── ClientesModel.js
│   │   ├── EmpleadosModel.js
│   │   ├── MantenimientosModel.js
│   │   ├── PagosModel.js
│   │   └── VehiculosModel.js
│   ├── routes
│   │   ├── AsistenciasRoutes.js
│   │   ├── ClientesRoutes.js
│   │   ├── EmpleadosRoutes.js
│   │   ├── MantenimientosRoutes.js
│   │   ├── PagosRoutes.js
│   │   └── VehiculosRoutes.js
│   ├── database.js
│   ├── server.js
│   └── index.js
├── tests
│   └── server.test.js
├── .env.example
├── .gitignore
├── .markdownlint.json
├── API-Documentation.json
├── babel.config.json
├── jest.config.json
├── package-lock.json
├── package.json
└── README.md
</pre>

<h1 id="pruebas">Pruebas</h1>

<p>
    Para ejecutar las pruebas del proyecto, se debe ejecutar el siguiente
    comando en la raíz del proyecto:
</p>
<pre><code>npm test</code></pre>

<h1 id="contribuciones">Contribuciones</h1>

<p>
    Si deseas contribuir al proyecto, por favor sigue los siguientes pasos:
</p>

<ol>
    <li>
        Haz un <code>fork</code> del proyecto
    </li>
    <li>
        Crea una nueva rama (<code>git checkout -b feature/nueva-funcionalidad</code>)
    </li>
    <li>
        Realiza los cambios necesarios
    </li>
    <li>
        Realiza un <code>commit</code> de los cambios
        (<code>git commit -am 'Agrega nueva funcionalidad'</code>)
    </li>
    <li>
        Realiza un <code>push</code> a la rama (<code>git push origin feature/nueva-funcionalidad</code>)
    </li>
    <li>
        Crea un nuevo <code>Pull Request</code>
    </li>
</ol>
