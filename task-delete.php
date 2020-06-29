<?php

include('conexion.php');

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

$query = "DELETE FROM tasks WHERE id = $id $or";
$result = mysqli_query($conn, $query);

echo $result ? "$cantidad Tareas Eliminadas" : 'Delete Failed';
