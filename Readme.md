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
    <li><a href="#licencia">Licencia</a></li>
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
