<?php
include('conexion.php');

$data = file_get_contents('php://input');
$_POST = json_decode($data, true);

$id = $_POST['id'];
$title = $_POST['title'];
$description = $_POST['description'];

$query = "UPDATE tasks SET title = '$title', description = '$description' WHERE id = $id";
$result = mysqli_query($conn, $query);

echo $result ? 'Tarea Modificada' : 'Update Failed';
