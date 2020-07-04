<?php

$data = file_get_contents('php://input');
$data = json_decode($data, true);
$cantidad = count($data);

$id = $data[0]['id'];
$or = '';

if (count($data) > 1) {
    for ($i = 1; $i < count($data); $i++) {
        $key = $data[$i]['id'];
        $or .= " OR id = $key";
    }
}

try {
    include('conexion.php');

    $statement = $conn->prepare("DELETE FROM tasks WHERE id = $id $or");
    $statement->execute();

    echo "$cantidad Tareas Eliminadas";
} catch (PDOException $e) {
    echo 'ERROR: ' . $e->getMessage();
}
