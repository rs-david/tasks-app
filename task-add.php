<?php
include('conexion.php');

$data = file_get_contents('php://input');
$_POST = json_decode($data, true);

$name = $_POST['name'];
$description = $_POST['description'];

$query = "INSERT INTO tasks(name, description) VALUES('$name', '$description')";
$result = mysqli_query($conn, $query);

echo $result ? "Tarea Guardada" : 'Save Failed';
