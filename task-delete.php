<?php

$data = json_decode($_POST['data'], true);

$id = $data[0];
$or = '';

if (count($data) > 1) {
    for ($i = 1; $i < count($data); $i++) {
        $key = $data[$i];
        $or .= " OR id = $key";
    }
}

try {
    include('conexion.php');

    $statement = $conn->prepare("DELETE FROM tasks WHERE id = $id $or");
    $statement->execute();

    $cantidad = count($data);
    echo "$cantidad Tareas Eliminadas";
} catch (PDOException $e) {
    echo 'ERROR: ' . $e->getMessage();
}
