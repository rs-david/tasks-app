<?php

session_start();
include('functions/functions.php');

if ($_SESSION["user"] && $_FILES['file']['type'] == 'application/json') {
    $filename = almacenarArchivo('file');
    $data = file_get_contents($filename);
    $tasks = json_decode($data, true);

    if (!json_last_error()) {
        $user_id = $_SESSION["user"];
        
        for ($i = 0; $i < 1000; $i++) {
            $task = $tasks[$i];
            $name = $task['name'];
            $description = $task['description'];
            $created = $task['created'];
            
            $values .= "($user_id, '$name', '$description', '$created')";
            if ($i < 1000 - 1) $values .= ",";
        }
        
        try {
            include('connection.php');

            $statement = $conn->prepare("INSERT INTO tasks(user_id, name, description, created) VALUES$values");
            $statement->execute();

            $response = ['content' => '¡Lista Guardada!', 'type' => 'success'];
        } catch (PDOException $e) {
            $error = 'ERROR: ' . $e->getMessage();
            $response = ['content' => 'Error En El Servidor', 'type' => 'danger', 'error' => $error];
        }
    } else {
        $response = ['content' => 'Archivo No Válido', 'type' => 'danger', 'error' => json_last_error_msg()];
    }
} else {
    $file_type = $_FILES['file']['type'];
    $response = ['content' => 'Archivo No Admitido', 'type' => 'warning', 'error' => "File Type: $file_type"];
}

echo json_encode($response);
