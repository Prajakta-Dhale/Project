      const taskInput = document.getElementById("task-input");
      const addTaskButton = document.getElementById("add-task");
      const taskList = document.getElementById("task-list");
      const filters = document.querySelectorAll(".filters button");
      const clearAllButton = document.getElementById("clear-all");

      let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
      let filter = "all";

      function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }

      function renderTasks() {
        taskList.innerHTML = "";
        tasks
          .filter((task) => {
            if (filter === "all") return true;
            if (filter === "completed") return task.completed;
            if (filter === "pending") return !task.completed;
          })
          .forEach((task, index) => {
            const li = document.createElement("li");
            li.className = task.completed ? "completed" : "";
            li.innerHTML = `
                    <span>${task.text}</span>
                    <div class="task-actions">
                        <button class="edit">Edit</button>
                        <button class="delete">Delete</button>
                    </div>
                `;
            li.addEventListener("click", (e) => {
              if (e.target.tagName !== "BUTTON") {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
              }
            });
            li.querySelector(".edit").addEventListener("click", () => {
              const newText = prompt("Edit task:", task.text);
              if (newText) {
                task.text = newText;
                saveTasks();
                renderTasks();
              }
            });
            li.querySelector(".delete").addEventListener("click", () => {
              tasks.splice(index, 1);
              saveTasks();
              renderTasks();
            });
            taskList.appendChild(li);
          });
      }

      addTaskButton.addEventListener("click", () => {
        const text = taskInput.value.trim();
        if (text) {
          tasks.push({ text, completed: false });
          saveTasks();
          renderTasks();
          taskInput.value = "";
        }
      });

      filters.forEach((button) => {
        button.addEventListener("click", () => {
          filters.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          filter = button.dataset.filter;
          renderTasks();
        });
      });

      clearAllButton.addEventListener("click", () => {
        tasks = [];
        saveTasks();
        renderTasks();
      });

      renderTasks();
   