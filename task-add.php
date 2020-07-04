<?php

$data = file_get_contents('php://input');
$data = json_decode($data, true);

$name = $data['name'];
$description = $data['description'];

try {
    include('conexion.php');

    $statement = $conn->prepare("INSERT INTO tasks(name, description) VALUES(:name, :description)");
    $statement->execute([':name'=>$name, ':description'=>$description]);

    echo "Tarea Guardada";
} catch (PDOException $e) {
    echo 'ERROR: ' . $e->getMessage();
}
