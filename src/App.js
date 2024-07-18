import React, { useEffect } from 'react';
import TodoList from './component/Todo.js';
import bridge from '@vkontakte/vk-bridge';

function App() {
  useEffect(() => {
    bridge.subscribe(({ detail: { type, data }}) => {
      if (type === 'VKWebAppUpdateConfig') {
        const schemeAttribute = document.createAttribute('scheme');
        schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
        document.body.attributes.setNamedItem(schemeAttribute);
      }
    });

    bridge.send('VKWebAppInit');

    // Для отладки - получение информации о пользователе
    bridge.send('VKWebAppGetUserInfo')
      .then((data) => {
        console.log('User info:', data);
      })
      .catch((error) => {
        console.error('Error getting user info:', error);
      });
  }, []);

  return (
    <div className="App">
      <TodoList />
    </div>
  );
}
export default App;
