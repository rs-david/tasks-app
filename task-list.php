<?php

include('conexion.php');
include('functions/functions.php');

$data = file_get_contents('php://input');
$_POST = json_decode($data, true);

$id = $_POST['id'] ?? '';
$title = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';
$column = $_POST['column'] ?? 'created';
$order = $_POST['order'] ?? 'DESC';
$limit = $_POST['limit'] ?? 100;

$query_count = "SELECT COUNT(*) AS totaltasks FROM tasks WHERE id LIKE '$id%' AND title LIKE '$title%' AND description LIKE '$description%' ORDER BY $column $order LIMIT $limit";
$results_count = mysqli_query($conn, $query_count);
$array_count = mysqli_fetch_assoc($results_count);
$total_tasks = $array_count['totaltasks'];

$query = "SELECT * FROM tasks WHERE id LIKE '$id%' AND title LIKE '$title%' AND description LIKE '$description%' ORDER BY $column $order LIMIT $limit";
$results = mysqli_query($conn, $query);

$mensaje = $limit >= $total_tasks ? 'All Tasks' : 'Not All Tasks';

while ($row = mysqli_fetch_array($results)) {
    $created = $row['created'];
    $day = date('d', strtotime($created));
    $month = spanishMonth(date('m', strtotime($created)));
    $year = date('Y', strtotime($created));
    $date = "$day/$month/$year";

    $tasks[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'date' => $date,
        'totaltasks' => $total_tasks,
        'mensaje' => $mensaje
    ];
}

$tasks_string = json_encode($tasks);
echo $tasks_string == 'null' ? 'No Tasks' : $tasks_string;
