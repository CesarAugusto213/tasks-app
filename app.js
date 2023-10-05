$(document).ready(function () {

    console.log("JQuery is working");

    const $search = $('#search');
    const $container = $('#container');
    const $taskResult = $('#task-result');
    const $taskForm = $('#task-form');
    const $tasks = $('#tasks');

    let editOn = false;

    $taskResult.hide();
    fetchTasks();

    //Buscar
    $search.keyup(function () {
        const search = $search.val();

        if (search) {
            $.post('task-search.php', { search }, function (response) {
                let tasks = JSON.parse(response);
                let template = ""

                tasks.forEach(task => {
                    template += `
                        <li>
                            ${task.name}
                        </li>
                    `
                });

                $container.html(template);
                $taskResult.show();
            });
        }
    });

    //Agregar o Editar
    $taskForm.submit(function (e) {
        const postData = {
            name: $('#name').val(),
            description: $('#description').val(),
            id: $('#id').val()
        };

        let url = editOn ? 'task-edit.php' : 'task-add.php';

        $.post(url, postData, function (response) {
            console.log(response)
            fetchTasks();
            $taskForm.trigger('reset');
        });

        e.preventDefault();
    });

    //Listar
    function fetchTasks() {
        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: function (response) {
                let tasks = JSON.parse(response);
                let template = "";

                tasks.forEach(task => {
                    template += `
                        <tr taskId="${task.id}">
                            <td>${task.id}</td>
                            <td>
                                <a href="#" class="task-item">${task.name}</a>
                            </td>
                            <td>${task.description}</td>
                            <td>
                                <button class="task-delete btn btn-danger">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    `
                });

                $tasks.html(template);
            }
        });
    }

    //Eliminar
    $(document).on('click', '.task-delete', function () {
        if (confirm('Are you sure you want to delete it')) {
            let id = getParentId($(this));
            $.post('task-delete.php', { id }, function () {
                fetchTasks();
            });
        }
    });

    //Buscar por Id
    $(document).on('click', '.task-item', function () {
        let id = getParentId($(this));

        $.post('task-single.php', { id }, function (response) {
            const task = JSON.parse(response);
            $('#id').val(task.id);
            $('#name').val(task.name);
            $('#description').val(task.description);
            editOn = true;
        });
    });

    function getParentId(context) {
        let element = context[0].parentElement.parentElement;
        return $(element).attr('taskId');
    }

});