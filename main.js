window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();//where we reached

		const todo = {
			content: e.target.elements.content.value,//content is an element in html
			category: e.target.elements.category.value,//category is an element in html
			done: false,//it is not ticked off, it is not done
			createdAt: new Date().getTime()
		}

		todos.push(todo);//adding the todo

		localStorage.setItem('todos', JSON.stringify(todos));//saving our local storage item, we stringified it as local storage only allows primative values to be saved

		// Resetting the form
		e.target.reset();

		DisplayTodos() //calling it so it can display the list
	})

	DisplayTodos()
})
//from here its showing the to dos
function DisplayTodos () {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = ""; //every time we call the function its going to clear all the elements

	todos.forEach(todo => {//looping through each to do in our array
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		//creating all the tags to be able to append to them
		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');

		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'personal') {//this will tell it if its blue or pink
			span.classList.add('personal');
		} else {
			span.classList.add('business');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');

		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';

		//appending everything in
		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);//appending everything over to the first defined div

		if (todo.done) {
			todoItem.classList.add('done');
		}
		//edit
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.done) {
				todoItem.classList.add('done');//making it striked when done
			} else {
				todoItem.classList.remove('done');//that way we can toggle weather its done or not
			}

			DisplayTodos()//every change we make we must re callthis function to save everyting back to the local storage

		})

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');//so youre allowed to edit it and not jus read it
			input.focus();
			input.addEventListener('blur', (e) => {//if we click outside of the input feild it will stop editing
				input.setAttribute('readonly', true);//making it so that you can only read it again
				todo.content = e.target.value;//setting the to do content to the new value
				localStorage.setItem('todos', JSON.stringify(todos));//saving it back in the local storage
				DisplayTodos()

			})
		})

		//deleting
		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);//if t is not the same as todo we remove it because we clicked it
			localStorage.setItem('todos', JSON.stringify(todos));//saving the change to the local storage
			DisplayTodos()
		})

	})
}