<?php
include('conexion.php');

$data = file_get_contents('php://input');
$_POST = json_decode($data, true);

$title = $_POST['title'];
$description = $_POST['description'];

$query = "INSERT INTO tasks(title, description) VALUES('$title', '$description')";
$result = mysqli_query($conn, $query);

echo $result ? "Tarea Guardada" : 'Save Failed';
