(function () {
  const frame = document.createElement('div');
  Object.assign(frame.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px',
    height: '600px',
    backgroundColor: '#f9f9f9',
    border: '2px solid #333',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
    borderRadius: '10px',
    overflow: 'hidden',
    fontFamily: 'Segoe UI, Arial, sans-serif'
  });

  const topBar = document.createElement('div');
  Object.assign(topBar.style, {
    height: '40px',
    backgroundColor: '#2c2c2c',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px',
    fontSize: '16px',
    cursor: 'move',
  });

  let isDragging = false, offsetX = 0, offsetY = 0;
  topBar.onmousedown = (e) => {
    isDragging = true;
    offsetX = e.clientX - frame.getBoundingClientRect().left;
    offsetY = e.clientY - frame.getBoundingClientRect().top;
  };
  document.onmouseup = () => isDragging = false;
  document.onmousemove = (e) => {
    if (isDragging) {
      frame.style.left = e.clientX - offsetX + 'px';
      frame.style.top = e.clientY - offsetY + 'px';
      frame.style.transform = 'none';
    }
  };

  const btns = document.createElement('div');
  Object.assign(btns.style, {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  });

  const createButton = (label, onClick, tooltip = '') => {
    const btn = document.createElement('div');
    btn.textContent = label;
    btn.title = tooltip;
    Object.assign(btn.style, {
      cursor: 'pointer',
      padding: '5px 12px',
      fontSize: '16px',
      backgroundColor: '#444',
      color: 'white',
      borderRadius: '5px',
      userSelect: 'none',
      transition: 'background-color 0.2s ease',
    });
    btn.onmouseover = () => btn.style.backgroundColor = '#666';
    btn.onmouseout = () => btn.style.backgroundColor = '#444';
    btn.onclick = onClick;
    return btn;
  };

  const minimizedBar = document.createElement('div');
  minimizedBar.textContent = '🔳 Click to Restore';
  Object.assign(minimizedBar.style, {
    position: 'fixed',
    bottom: '10px',
    left: '10px',
    backgroundColor: '#444',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 9999,
    display: 'none',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
  });
  minimizedBar.onclick = () => {
    frame.style.display = 'flex';
    minimizedBar.style.display = 'none';
  };
  document.body.appendChild(minimizedBar);

  const minimizeBtn = createButton('➖', () => {
    frame.style.display = 'none';
    minimizedBar.style.display = 'block';
  }, 'Minimize');

  const closeBtn = createButton('❌', () => {
    frame.remove();
    minimizedBar.remove();
    document.removeEventListener('keydown', panicHandler);
  }, 'Close');

  const recenterBtn = createButton('🎯', () => {
    frame.style.top = '50%';
    frame.style.left = '50%';
    frame.style.transform = 'translate(-50%, -50%)';
  }, 'Recenter');

  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    flexGrow: 1,
    border: 'none',
    backgroundColor: '#fff',
  });
  iframe.src = '';

  const placeholder = document.createElement('div');
  placeholder.textContent = '🔗 Enter a link to begin';
  Object.assign(placeholder.style, {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#666',
    pointerEvents: 'none',
  });
  frame.appendChild(placeholder);

  const linkBtn = createButton('🔗', () => {
    const url = prompt('Enter link to load:');
    if (url) {
      iframe.src = url;
      placeholder.style.display = 'none';
    }
  }, 'Set Game Link');

  let panicKey = null;
  let panicEnabled = false;

  const panicBtn = createButton('🛑', () => {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      color: 'white',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      fontSize: '18px',
    });

    const msg = document.createElement('div');
    msg.textContent = 'Press any key to assign your panic key';
    msg.style.marginBottom = '15px';

    const keyDisplay = document.createElement('div');
    keyDisplay.textContent = '⛔ None';
    Object.assign(keyDisplay.style, {
      fontSize: '24px',
      marginBottom: '10px',
      color: '#ff5252'
    });

    const label = document.createElement('label');
    label.style.display = 'flex';
    label.style.alignItems = 'center';
    label.style.marginBottom = '15px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.marginRight = '10px';

    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = '✔ Confirm';
    Object.assign(confirmBtn.style, {
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      padding: '10px 20px',
      fontSize: '16px',
      cursor: 'pointer'
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode('Enable panic key'));

    overlay.appendChild(msg);
    overlay.appendChild(keyDisplay);
    overlay.appendChild(label);
    overlay.appendChild(confirmBtn);
    document.body.appendChild(overlay);

    const keyListener = (e) => {
      panicKey = e.key;
      keyDisplay.textContent = `🔐 Key: "${panicKey}"`;
      keyDisplay.style.color = '#4caf50';
    };

    const cleanup = () => {
      document.removeEventListener('keydown', keyListener);
      document.body.removeChild(overlay);
    };

    document.addEventListener('keydown', keyListener);
    confirmBtn.onclick = () => {
      panicEnabled = checkbox.checked;
      alert(`Panic key set to "${panicKey}". Enabled: ${panicEnabled}`);
      cleanup();
    };
  }, 'Set Panic Key');

  const panicHandler = (e) => {
    if (panicEnabled && e.key === panicKey) {
      frame.remove();
      minimizedBar.remove();
      document.removeEventListener('keydown', panicHandler);
    }
  };
  document.addEventListener('keydown', panicHandler);

  [linkBtn, recenterBtn, panicBtn, minimizeBtn, closeBtn].forEach(btn => btns.appendChild(btn));
  topBar.appendChild(btns);

  frame.appendChild(topBar);
  frame.appendChild(iframe);
  document.body.appendChild(frame);
})();
