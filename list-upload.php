<?php

include('conexion.php');
include('functions/functions.php');

$filename = almacenarArchivo('file');

if ($_FILES['file']['type'] == 'application/json') {
    $data = file_get_contents($filename);
    $list = json_decode($data, true);

    for ($i = 0; $i < 1000; $i++) {
        $task = $list[$i];
        $name = $task['name'];
        $description = $task['description'];
        $created = $task['created'];

        $values .= "('$name', '$description', '$created')";
        if ($i < 1000 - 1) $values .= ",";
    }

    $query = "INSERT INTO tasks(name, description, created) VALUES$values";
    $results = mysqli_query($conn, $query);

    echo $results ? 'Tareas Guardadas' : 'Save Failed';
} else {
    $link = $_SERVER['HTTP_REFERER'] . $filename;
    echo $link;
}
