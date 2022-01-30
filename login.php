<?php

$session_started = session_start();

if ($_SESSION["user"]) {
    header('location: index.php');
    exit;
} else {
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST) {
        try {
            require 'connection.php';
            require 'functions/sessions.php';

            $user = filtrarDatos($_POST['user']);
            $password = filtrarDatos($_POST['password']);

            // Revisar Campos Vacios.
            if (empty($user) || empty($password)) $errors[] = 'Llena Todos Los Campos';

            // Verificar Si Usuario Existe.
            $user_id = obtenerClaveDeUsuario($conn, $user);
            if (!$user_id) $errors[] = 'Éste Usuario No Está Registrado';

            if (!$errors) {
                // Verificar Si Contraseña Es Correcta.
                $correct_password = verificarContraseña($conn, $user, $password);
                if (!$correct_password) $errors[] = 'Contraseña Incorrecta';

                if (!$errors) {
                    // Iniciar Sesión.
                    $_SESSION['user'] = $user_id;
                    header('location: index.php');
                    exit;
                }
            }
        } catch (PDOException $e) {
            echo 'ERROR: ' . $e->getMessage();  /* Ocultar */
            $notification = 'Ocurrio Un Error: Inicio De Sesión Fallido';
        }
    }

    require 'login.view.php';
}
