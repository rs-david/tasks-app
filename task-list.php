<?php
setlocale(LC_ALL, 'spanish');
include('conexion.php');

// Convertir Datos Recibidos en Array.
$data = file_get_contents('php://input');
$data = json_decode($data, true);

// Manejar Datos del Array.
$id = $data['id'] ?? '';
$name = $data['name'] ?? '';
$description = $data['description'] ?? '';
$column = $data['column'] ?? 'created';
$order = $data['order'] ?? 'DESC';
$limit = $data['limit'] ?? 100;

// Obtener Cantidad Total de Tareas.
$total = "SELECT COUNT(*) AS total FROM tasks";
$total = mysqli_fetch_assoc(mysqli_query($conn, $total))["total"];

// Obtener Tareas.
$query = "SELECT * FROM
            (SELECT COUNT(*) AS results FROM tasks WHERE id LIKE '$id%' AND name LIKE '$name%' AND description LIKE '$description%') AS resultados,
            (SELECT * FROM tasks WHERE id LIKE '$id%' AND name LIKE '$name%' AND description LIKE '$description%' ORDER BY $column $order LIMIT $limit) AS tareas";
$results = mysqli_query($conn, $query);

// Crear Array Lista de Tareas.
while ($row = mysqli_fetch_array($results)) {
    $created = new DateTime($row['created']);
    $date = strftime('%d/%B/%Y', $created->getTimestamp());

    $list[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'description' => $row['description'],
        'date' => $date,
        'total' => $total,
        'results' => $row['results']
    ];
}

// Crear Array Alternativa.
$alter = ['total' => $total, 'results' => 0];

// Crear Json del Array.
$json = $list == null ? json_encode($alter) : json_encode($list);

// Mostrar.
echo $json;
