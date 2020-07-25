<?php

$session_started = session_start();

if ($_SESSION["user"]) {
    header('location: index.php');
    exit;
} else {
    if ($_SERVER['REQUEST_METHOD'] == 'POST' && $_POST) {
        require 'functions/functions.php';

        $user = filtrarDatos($_POST['user']);
        $password = filtrarDatos($_POST['password']);

        // Revisar Campos Vacios.
        if (empty($user) || empty($password)) $errors[] = 'Llena Todos Los Campos';

        try {
            require 'connection.php';

            // Verificar Si Usuario Existe.
            $user_exists = verificarUsuario($conn, $user);
            if (!$user_exists) $errors[] = 'Éste Usuario No Está Registrado';

            if (!$errors) {
                // Verificar Si Contraseña Es Correcta.
                $correct_password = verificarContraseña($conn, $user, $password);
                if (!$correct_password) $errors[] = 'Contraseña Incorrecta';

                if (!$errors) {
                    // Iniciar Sesión.
                    $_SESSION['user'] = $user;
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
