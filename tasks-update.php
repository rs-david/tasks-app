<?php

$data = json_decode($_POST['data'], true);

$id = $data['id'];
$name = $data['name'];
$description = $data['description'];

try {
    include('connection.php');
    
    $statement = $conn->prepare("UPDATE tasks SET name = :name, description = :description WHERE id = :id");
    $statement->execute([':id'=>$id, ':name'=>$name, ':description'=>$description]);

    echo 'Tarea Modificada';
} catch (PDOException $e) {
    echo 'ERROR: ' . $e->getMessage();
}
