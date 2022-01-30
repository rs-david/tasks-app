<?php

session_start();
include('functions/files.php');
$file = $_FILES['file'];

if ($_SESSION["user"] && $file['type'] == 'application/json') {
    // Se Almacena El Archivo (JSON) Para Su Posterior Uso.
    $file_location = almacenarArchivo($file);
    // Obtenemos El Archivo Ya Almacenado.
    $data = file_get_contents($file_location);
    // Convertimos El Archivo En Array.
    $tasks = json_decode($data, true);
    // Obtenemos La Cantidad De Tareas & Creamos Un Límite.
    $total_tasks = count($tasks);
    $limit = 1000;

    // Verificamos La Cantidad De Registros.
    if ($total_tasks <= $limit) {
        // Válidamos El Archivo JSON.
        if (!json_last_error()) {
            $user_id = $_SESSION["user"];

            // Construimos Una Consulta SQL Para Insertar Los Registros Del Array En La BD.
            for ($i = 0; $i < $total_tasks; $i++) {
                $task = $tasks[$i];
                $name = $task['name'];
                $description = $task['description'];
                $created = $task['created'];

                $values .= "($user_id, '$name', '$description', '$created')";
                if ($i < $total_tasks - 1) $values .= ",";
            }

            try {
                include('connection.php');

                $statement = $conn->prepare("INSERT INTO tasks(user_id, name, description, created) VALUES$values");
                $statement->execute();

                $response = ['content' => '¡Lista Guardada!', 'type' => 'success'];
            } catch (PDOException $e) {
                // Manejamos Errores De Servidor.
                $error = 'ERROR: ' . $e->getMessage();
                $response = ['content' => 'Error En El Servidor', 'type' => 'danger', 'error' => "Server Error: $error"];
            }
        } else {
            // Manejamos Errores Del JSON.
            $error = json_last_error_msg();
            $response = ['content' => 'Archivo No Válido', 'type' => 'danger', 'error' => "Invalid File: $error"];
        }
    } else {
        // Manejamos El Error De Límite De Registros.
        $response = ['content' => "Máximo $limit Registros A La Vez", 'type' => 'warning', 'error' => "Limit Exceeded: $total_tasks"];
    }
} else {
    // Manejamos Los Errores De Archivo No Admitido.
    $file_type = $file['type'];
    $response = ['content' => 'Archivo No Admitido', 'type' => 'warning', 'error' => "File Type Error: $file_type"];
}

// Enviamos La Respuesta.
echo json_encode($response);
