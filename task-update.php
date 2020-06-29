<?php
include('conexion.php');

$data = file_get_contents('php://input');
$data = json_decode($data, true);

$id = $data['id'];
$name = $data['name'];
$description = $data['description'];

$query = "UPDATE tasks SET name = '$name', description = '$description' WHERE id = $id";
$result = mysqli_query($conn, $query);

echo $result ? 'Tarea Modificada' : 'Update Failed';
