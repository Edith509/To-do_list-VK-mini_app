import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import icon from '../images/icon.png'; // обновите путь к иконке
import '../style/style.css';

const Todolist = () => {
  const [inputValue, setInputValue] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Загрузка данных из локального хранилища при первом рендере
    const savedTasks = localStorage.getItem('todoData');
    console.log('Loading data:', savedTasks);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    // Вызываем функцию для показа баннерной рекламы при загрузке компонента
    showBannerAd();
  }, []);

  useEffect(() => {
    // Сохранение данных в локальное хранилище при каждом изменении tasks
    console.log('Saving data:', tasks);
    localStorage.setItem('todoData', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (inputValue === '') {
      alert('Пустую заметку добавить нельзя!!!');
    } else {
      const newTask = { text: inputValue, checked: false };
      setTasks([...tasks, newTask]);
      setInputValue('');
    }
  };

  const toggleTask = index => {
    const newTasks = tasks.map((task, i) => {
      if (i === index) {
        return { ...task, checked: !task.checked };
      }
      return task;
    });
    setTasks(newTasks);
  };

  const removeTask = index => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  const showBannerAd = () => {
    bridge.send('VKWebAppShowBannerAd', { banner_location: 'bottom' })
    .then((data) => {
      if (data.result) {
        // Реклама успешно отобразилась
        console.log('Реклама отобразилась');
      }
    })
    .catch((error) => {
      // Обработка ошибки
      console.error('Ошибка при показе баннерной рекламы:', error);
    });
  };

  return (
    <div className="container">
      <div className="todo_app">
        <h2>Список Дел <img src={icon} alt="icon" /></h2>
        <div className="row">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Добавить текст"
          />
          <button onClick={addTask}>Добавить</button>
        </div>
        <ul id="list_container">
          {tasks.map((task, index) => (
            <li key={index} className={task.checked ? 'checked' : ''} onClick={() => toggleTask(index)}>
              {task.text}
              <span onClick={(e) => {
                e.stopPropagation();
                removeTask(index);
              }}>&times;</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Todolist;
