document.addEventListener("DOMContentLoaded", () => {
    let selectedTask = null;

    // Function to update the task card based on sidebar input
    function updateTaskCard() {
        if (selectedTask) {
            const taskName = document.getElementById('task-name-input').value;
            const taskShortNote = document.getElementById('task-short-note-input').value;
            const taskLink = document.getElementById('task-links-input').value;
            const taskNotes = document.getElementById('task-notes-input').value;
            const taskReference = document.getElementById('task-references-input').value;

            selectedTask.querySelector('.task-name').textContent = taskName;
            selectedTask.querySelector('.task-short-note').textContent = taskShortNote;
            selectedTask.setAttribute('data-link', taskLink);
            selectedTask.setAttribute('data-notes', taskNotes);
            selectedTask.setAttribute('data-reference', taskReference);

            // Update the link button functionality
            const linkBtn = selectedTask.querySelector('.link-btn');
            linkBtn.onclick = () => {
                if (taskLink) {
                    window.open(taskLink, '_blank');
                } else {
                    alert('No link provided.');
                }
            };

            // Update the reference button functionality
            const referenceBtn = selectedTask.querySelector('.reference-btn');
            referenceBtn.onclick = () => {
                if (taskReference) {
                    window.open(taskReference, '_blank');
                } else {
                    alert('No reference link provided.');
                }
            };

            // Close the sidebar after saving
            document.getElementById('sidebar').style.right = '-300px';
        }
    }

    // Function to delete the selected task
    function deleteTask() {
        if (selectedTask) {
            selectedTask.remove();
            document.getElementById('sidebar').style.right = '-300px'; // Close the sidebar after deletion
        }
    }

    // Add New Project button
    document.getElementById('add-task-btn').addEventListener('click', () => {
        const columns = document.querySelectorAll('.column');
        if (columns.length === 0) {
            alert('No column present to insert the project cell');
            return;
        }
        const column = columns[0]; // Insert into the first column
        const newTaskId = Date.now(); // Unique ID for new task
        const newTaskCard = document.createElement('div');
        newTaskCard.classList.add('task-card');
        newTaskCard.setAttribute('draggable', 'true');
        newTaskCard.setAttribute('data-task-id', newTaskId);

        newTaskCard.innerHTML = `
            <h3 class="task-name">New Project</h3>
            <p class="task-short-note">Short note here...</p>
            <div class="task-actions">
                <button class="rename-btn">Rename</button>
                <button class="link-btn">Link</button>
                <button class="reference-btn">Reference</button>
                <button class="delete-btn">Delete</button> <!-- Added delete button -->
            </div>
        `;

        // Add event listeners for the new task
        newTaskCard.addEventListener('dragstart', () => {
            newTaskCard.classList.add('dragging');
        });

        newTaskCard.addEventListener('dragend', () => {
            newTaskCard.classList.remove('dragging');
        });

        // Add double-click event listener to open the sidebar
        newTaskCard.addEventListener('dblclick', () => {
            selectedTask = newTaskCard;
            document.getElementById('task-name-input').value = newTaskCard.querySelector('.task-name').textContent;
            document.getElementById('task-short-note-input').value = newTaskCard.querySelector('.task-short-note').textContent;
            document.getElementById('task-links-input').value = newTaskCard.getAttribute('data-link') || '';
            document.getElementById('task-notes-input').value = newTaskCard.getAttribute('data-notes') || '';
            document.getElementById('task-references-input').value = newTaskCard.getAttribute('data-reference') || '';
            document.getElementById('sidebar').style.right = '0';
        });

        column.querySelector('.task-list').appendChild(newTaskCard);

        // Initialize task action buttons
        initializeTaskActions(newTaskCard);
    });

    // Add New Column button
    document.getElementById('add-column-btn').addEventListener('click', () => {
        const columnName = prompt('Enter column name:');
        if (!columnName) return;

        const newColumn = document.createElement('div');
        newColumn.classList.add('column');
        newColumn.innerHTML = `
            <div class="column-header">
                <h2>${columnName}</h2>
                <button class="rename-column-btn">Rename</button>
                <button class="delete-column-btn">Delete</button>
            </div>
            <div class="task-list" ondrop="drop(event)" ondragover="allowDrop(event)">
                <!-- Tasks will be dynamically added here -->
            </div>
        `;

        // Add the new column to the board
        document.getElementById('board').appendChild(newColumn);

        // Initialize column buttons
        initializeColumnButtons(newColumn);
    });

    // Initialize column buttons
    function initializeColumnButtons(column) {
        column.querySelector('.rename-column-btn').addEventListener('click', () => {
            const newName = prompt('Enter new column name:');
            if (newName) {
                column.querySelector('h2').textContent = newName;
            }
        });

        column.querySelector('.delete-column-btn').addEventListener('click', () => {
            if (column.querySelectorAll('.task-card').length > 0) {
                alert('Move all cells to a different column before deleting.');
                return;
            }
            column.remove();
        });
    }

    // Initialize task actions
    function initializeTaskActions(task) {
        task.querySelector('.rename-btn').addEventListener('click', () => {
            const newName = prompt('Enter new task name:');
            if (newName) {
                task.querySelector('.task-name').textContent = newName;
            }
        });

        task.querySelector('.link-btn').addEventListener('click', () => {
            const link = task.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank');
            } else {
                alert('No link provided.');
            }
        });

        task.querySelector('.reference-btn').addEventListener('click', () => {
            const reference = task.getAttribute('data-reference');
            if (reference) {
                window.open(reference, '_blank');
            } else {
                alert('No reference link provided.');
            }
        });

        task.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                task.remove();
                document.getElementById('sidebar').style.right = '-300px'; // Close the sidebar after deletion
            }
        });
    }

    // Add drag and drop functionality
    document.getElementById('board').addEventListener('dragover', allowDrop);
    document.getElementById('board').addEventListener('drop', drop);

    function allowDrop(event) {
        event.preventDefault();
    }

    function drop(event) {
        event.preventDefault();
        const draggingTask = document.querySelector('.dragging');
        const target = event.target.closest('.task-list');

        if (target && target !== draggingTask.parentNode) {
            target.appendChild(draggingTask);
        }
    }

    // Sidebar controls
    document.getElementById('close-sidebar').addEventListener('click', () => {
        document.getElementById('sidebar').style.right = '-300px';
    });

    document.getElementById('save-task-details').addEventListener('click', updateTaskCard);

    // Attach event listeners to existing task cards
    document.querySelectorAll('.task-card').forEach(task => {
        task.addEventListener('dblclick', () => {
            selectedTask = task;
            document.getElementById('task-name-input').value = task.querySelector('.task-name').textContent;
            document.getElementById('task-short-note-input').value = task.querySelector('.task-short-note').textContent;
            document.getElementById('task-links-input').value = task.getAttribute('data-link') || '';
            document.getElementById('task-notes-input').value = task.getAttribute('data-notes') || '';
            document.getElementById('task-references-input').value = task.getAttribute('data-reference') || '';
            document.getElementById('sidebar').style.right = '0';
        });
    });
});
