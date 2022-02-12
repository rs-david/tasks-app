<?php
session_start();
setlocale(LC_ALL, 'spanish');

$user_id = $_SESSION["user"] ?? 0;

// Convertir Datos Recibidos en Array.
$data = json_decode($_POST['data'], true);

// SEARCH DATA
// Crear Query "AND LIKE" De Columnas & Crear Datos Para El "execute".
$execute_data[":user_id"] = $user_id;
foreach ($data["searchdata"] as $column => $column_value) {
    $and_like_columns .= "AND $column LIKE :$column ";
    $execute_data[":$column"] = "$column_value%";
}

// LIST DATA
// Crear Query de Columnas.
$columns_array = $data["listdata"]["columns"];
$columns_query = implode(',', $columns_array);

// Datos de Consulta.
$columns = $columns_query ?? 'id, name, description, created';
$table = $data['listdata']['table'] ?? 'tasks';
$column = $data['listdata']['column'] ?? "created";
$sort = $data['listdata']['sort'] ?? "DESC";
$limit = $data['listdata']['limit'] ?? 50;

try {
    include('connection.php');

    // Obtener Cantidad Total de Registros & Cantidad de Registros Encontrados Debido a la Búsqueda.
    $sums = $conn->prepare("SELECT * FROM
                                (SELECT COUNT(*) AS total_records FROM $table WHERE user_id=:user_id) AS total_table,
                                (SELECT COUNT(*) AS total_results FROM $table WHERE user_id=:user_id $and_like_columns) AS results_table");
    $sums->execute($execute_data);
    $sums = $sums->fetch();
    $total_records = $sums["total_records"];
    $total_results = $sums["total_results"];

    if ($total_results > 0) {
        // Obtener Registros.
        $rows = $conn->prepare("SELECT $columns FROM $table WHERE user_id=:user_id $and_like_columns ORDER BY $column $sort LIMIT $limit");
        $rows->execute($execute_data);

        // Crear Lista De Registros.
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

    // Crear Respuesta Con Los Datos Pedidos.
    $response = ['records' => $records, 'total-records' => $total_records, 'total-results' => $total_results, 'table' => $table];
} catch (PDOException $e) {

    // Crear Respuesta De Error.
    $error = 'ERROR: ' . $e->getMessage();
    $response = ['error' => $error];
}

// Enviar Respuesta En Formato JSON.
echo json_encode($response);
