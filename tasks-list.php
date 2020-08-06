<?php
session_start();
setlocale(LC_ALL, 'spanish');

// Convertir Datos Recibidos en Array.
$data = json_decode($_POST['data'], true);

// Manejar Datos del Array.
$id = $data['id'] ? "$data[id]%" : '%';
$name = $data['name'] ? "$data[name]%" : '%';
$description = $data['description'] ? "$data[description]%" : '%';
$user_id = $_SESSION["user"] ?? 0;
$column = $data['column'] ?? "created";
$sort = $data['sort'] ?? "DESC";
$limit = $data['limit'] ?? 100;

try {
    include('connection.php');

    // Obtener Cantidad Total de Tareas.
    $total = $conn->prepare('SELECT COUNT(*) AS total FROM tasks WHERE user_id=:user_id');
    $total->execute([':user_id' => $user_id]);
    $total = $total->fetch();
    $total = $total["total"];

    // Obtener Tareas.
    $tasks = $conn->prepare("SELECT * FROM
                                (SELECT COUNT(*) AS results FROM tasks WHERE user_id = :user_id AND id LIKE :id AND name LIKE :name AND description LIKE :description) AS resultados,
                                (SELECT * FROM tasks WHERE user_id=:user_id AND id LIKE :id AND name LIKE :name AND description LIKE :description ORDER BY $column $sort LIMIT $limit) AS tareas");
    $tasks->execute([':user_id' => $user_id, ':id' => $id, ':name' => $name, ':description' => $description]);

    // Crear Array Lista Tareas.
    while ($row = $tasks->fetch(PDO::FETCH_ASSOC)) {
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

    // Crear Respuesta.
    $response = $list ?? $alter;
} catch (PDOException $e) {
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['message' => 'Error En El Servidor', 'type' => 'danger', 'error' => $error];
}

echo json_encode($response);
