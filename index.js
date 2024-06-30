const add = document.querySelector('.add')
const clear = document.querySelector('.clear')

const storage = JSON.parse(localStorage.getItem('users')) || {}
console.log(storage);
/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete')
    const changeBtn = userCard.querySelector('.change')

    const userEmail = deleteBtn.dataset.deleteUserEmail

    deleteBtn.addEventListener('click', () => {
        userCard.remove()
        delete storage[userCard.dataset.email]
        localStorage.clear()
        localStorage.setItem('users', JSON.stringify(storage))
    })

    changeBtn.addEventListener('click', () => {
        console.log(
            `%c Изменение пользователя ${userEmail} `,
            'background: green; color: white',
        )
        console.log(storage[userCard.dataset.email])
        document.querySelector('#name').value = storage[userCard.dataset.email].name
        document.querySelector('#secondName').value = storage[userCard.dataset.email].secondName
        document.querySelector('#email').value = storage[userCard.dataset.email].email
        document.querySelector('#city').value = storage[userCard.dataset.email].city
        document.querySelector('#occupation').value = storage[userCard.dataset.email].occupation
    })
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.email - email пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({ name, secondName, email, city, occupation }) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p class="email">${email}</p>
                <p>${city}</p>
                <p>${occupation}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users')

    if (!storage) {
        console.log('localStorage пустой')
        return
    }

    users.innerHTML = ''

    Object.keys(storage).forEach((email) => {
        const userData = storage[email]
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(userData)
        users.append(userCard)
        setListeners(userCard)
    })
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault()
    const newName = document.querySelector('#name')
    const newSecondName = document.querySelector('#secondName')
    const newEmail = document.querySelector('#email')
    const newCity = document.querySelector('#city')
    const newOccupation = document.querySelector('#occupation')

    const users = document.querySelector('.users')

    if (!newEmail.value
        || !newName.value
        || !newSecondName.value
        || !newCity.value
        || !newOccupation.value
    ) {
        resetInputs(newName, newSecondName, newEmail, newCity, newOccupation)
        console.log('no');
        return
    }

    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        email: newEmail.value,
        city: newCity.value,
        occupation: newOccupation.value
    }
    if (!(newEmail.value in storage)) {
        storage[newEmail.value] = data
    
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = newEmail.value
        userCard.innerHTML = createCard(data)
        users.append(userCard)
        setListeners(userCard)
    } else {
        let card = users.querySelector(`[data-email='${data.email}']`);
        let [name, secondName, , city, occupation] = card.querySelectorAll('p');
        name.textContent = newName.value
        secondName.textContent = newSecondName.value
        city.textContent = newCity.value
        occupation.textContent = newOccupation.value
        storage[newEmail.value].name = newName.value
        storage[newEmail.value].secondName = newSecondName.value
        storage[newEmail.value].city = newCity.value
        storage[newEmail.value].occupation = newOccupation.value
    }
    // Добавление данных в localStorage
    localStorage.setItem('users', JSON.stringify(storage))
    resetInputs(newName, newSecondName, newEmail, newCity, newOccupation)

    console.log(storage)
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
    console.log('reset')
}

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
	})
