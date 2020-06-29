<?php

include('conexion.php');

$data = file_get_contents('php://input');
$data = json_decode($data, true);

$name = $data['name'];
$description = $data['description'];

$query = "INSERT INTO tasks(name, description) VALUES('$name', '$description')";

$result = mysqli_query($conn, $query);

echo $result ? "Tarea Guardada" : 'Save Failed';
