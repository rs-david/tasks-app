<?php
setlocale(LC_ALL, 'spanish');

// Convertir Datos Recibidos en Array.
$data = json_decode($_POST['data'], true);

// Manejar Datos del Array.
$id = $data['id'] ? "$data[id]%" : '%';
$name = $data['name'] ? "$data[name]%" : '%';
$description = $data['description'] ? "$data[description]%" : '%';
$column = $data['column'] ?? "created";
$sort = $data['sort'] ?? "DESC";
$limit = $data['limit'] ?? 100;

try {
    include('conexion.php');

    // Obtener Cantidad Total de Tareas.
    $total = $conn->query('SELECT COUNT(*) AS total FROM tasks');
    $total = $total->fetch(PDO::FETCH_ASSOC);
    $total = $total["total"];

    // Obtener Tareas.
    $tasks = $conn->prepare("SELECT * FROM
                                (SELECT COUNT(*) AS results FROM tasks WHERE id LIKE :id AND name LIKE :name AND description LIKE :description) AS resultados,
                                (SELECT * FROM tasks WHERE id LIKE :id AND name LIKE :name AND description LIKE :description ORDER BY $column $sort LIMIT $limit) AS tareas");
    $tasks->execute([':id' => $id, ':name' => $name, ':description' => $description]);

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

    // Crear Json del Array.
    $json = $list == null ? json_encode($alter) : json_encode($list);

    // Mostrar.
    echo $json;
} catch (PDOException $e) {
    echo 'ERROR: ' . $e->getMessage();
}
