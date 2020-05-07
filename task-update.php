<?php
include('conexion.php');

$data = file_get_contents('php://input');
$_POST = json_decode($data, true);

$id = $_POST['id'];
$name = $_POST['name'];
$description = $_POST['description'];

$query = "UPDATE tasks SET name = '$name', description = '$description' WHERE id = $id";
$result = mysqli_query($conn, $query);

echo $result ? 'Tarea Modificada' : 'Update Failed';
