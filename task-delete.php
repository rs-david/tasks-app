<?php
include('conexion.php');

$data = file_get_contents('php://input');
$_POST = json_decode($data, true);

$id = $_POST['id'];

$query = "DELETE FROM tasks WHERE id = $id";
$result = mysqli_query($conn, $query);

echo $result ? "Tarea Eliminada" : 'Delete Failed';
