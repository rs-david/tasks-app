<?php
session_start();
setlocale(LC_ALL, 'spanish');

// User ID.
$user_id = $_SESSION["user"] ?? 0;

// Convertir Datos Recibidos en Array.
$data = json_decode($_POST['data'], true);

// Manejar Datos Recibidos (Array).
$id = $data['id'] ? "$data[id]%" : '%';
$name = $data['name'] ? "$data[name]%" : '%';
$description = $data['description'] ? "$data[description]%" : '%';
$column = $data['column'] ?? "created";
$sort = $data['sort'] ?? "DESC";
$limit = $data['limit'] ?? 50;

try {
    include('connection.php');
    
    // Obtener Cantidad Total de Tareas & Cantidad de Tareas Encontradas.
    $sums = $conn->prepare("SELECT * FROM
                                (SELECT COUNT(*) AS total FROM tasks WHERE user_id=:user_id) AS total_table,
                                (SELECT COUNT(*) AS results FROM tasks WHERE user_id=:user_id AND id LIKE :id AND name LIKE :name AND description LIKE :description) AS results_table");
    $sums->execute([':user_id' => $user_id, ':id' => $id, ':name' => $name, ':description' => $description]);;
    $sums = $sums->fetch();
    $total = $sums["total"];
    $results = $sums["results"];

    //Crear la Lista de Tareas.
    $list;

    if ($results > 0) {
        // Obtener Tareas.
        $tasks = $conn->prepare("SELECT * FROM tasks WHERE user_id=:user_id AND id LIKE :id AND name LIKE :name AND description LIKE :description ORDER BY $column $sort LIMIT $limit");
        $tasks->execute([':user_id' => $user_id, ':id' => $id, ':name' => $name, ':description' => $description]);

        // Llenar la Lista De Tareas.
        while ($row = $tasks->fetch(PDO::FETCH_ASSOC)) {
            $created = new DateTime($row['created']);
            $date = strftime('%d/%B/%Y', $created->getTimestamp());

            $list[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'description' => $row['description'],
                'date' => $date,
            ];
        }
    }

    // Crear Respuesta Con Los Datos Pedidos.
    $response = ['tasks' => $list, 'total' => $total, 'results' => $results];
} catch (PDOException $e) {

    // Crear Respuesta De Error.
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['message' => 'Error En El Servidor', 'type' => 'danger', 'error' => $error];
}

// Enviar Respuesta.
echo json_encode($response);
