<?php
session_start();
setlocale(LC_ALL, 'spanish');

// User ID.
$user_id = $_SESSION["user"] ?? 0;

// Convertir Datos Recibidos en Array.
$data = json_decode($_POST['data'], true);

// SEARCH DATA
// Crear Query AND/LIKE y Datos "execute".
$execute_data[":user_id"] = $user_id;
foreach ($data["search"] as $column => $column_value) {
    $and_like_query .= "AND $column LIKE :$column ";
    $execute_data[":$column"] = "$column_value%";
}

// LIST DATA
// Crear Query de Columnas.
$columns_array = $data["list"]["columns"] ?? ['id', 'name', 'description', 'created'];
for ($i = 0; $i < count($columns_array); $i++) {
    $columns_query .= "$columns_array[$i]";
    if ($i < count($columns_array) - 1) $columns_query .= ",";
}
// Crear Datos de Consulta.
$table = $data['list']['table'] ?? 'tasks';
$column = $data['list']['column'] ?? "created";
$sort = $data['list']['sort'] ?? "DESC";
$limit = $data['list']['limit'] ?? 50;
$columns = $columns_query ?? 'id, name, description, created';

try {
    include('connection.php');

    // Obtener Cantidad Total de Registros & Cantidad de Registros Encontrados en Base a los Datos de Búsqueda.
    $sums = $conn->prepare("SELECT * FROM
                                (SELECT COUNT(*) AS records FROM $table WHERE user_id=:user_id) AS total_table,
                                (SELECT COUNT(*) AS results FROM $table WHERE user_id=:user_id $and_like_query) AS results_table");
    $sums->execute($execute_data);
    $sums = $sums->fetch();
    $total_records = $sums["records"];
    $total_results = $sums["results"];

    if ($total_results > 0) {
        // Obtener Tareas.
        $rows = $conn->prepare("SELECT $columns FROM $table WHERE user_id=:user_id $and_like_query ORDER BY $column $sort LIMIT $limit");
        $rows->execute($execute_data);

        // Crear Lista De Tareas.
        while ($row = $rows->fetch(PDO::FETCH_ASSOC)) {
            $records[] = $row;
        }

        // if ($row['created']) {
        //     $created = new DateTime($row['created']);
        //     $date = strftime('%d/%B/%Y', $created->getTimestamp());
        // }
        // $records[] = [
        //     'id' => $row['id'],
        //     'name' => $row['name'],
        //     'description' => $row['description'],
        //     'date' => $date,
        // ];

    }

    $response = ['records' => $records, 'total' => $total_records, 'results' => $total_results, 'table' => $table];
    // Crear Respuesta Con Los Datos Pedidos.
} catch (PDOException $e) {

    // Crear Respuesta De Error.
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['message' => 'Error En El Servidor', 'type' => 'danger', 'error' => $error];
}

// Enviar Respuesta.
echo json_encode($response);
