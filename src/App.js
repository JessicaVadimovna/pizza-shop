import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import menuData from './menuData';
import './App.css';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  // Компенсация ширины скроллбара
  useEffect(() => {
    const handleScrollBar = () => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.documentElement.style.overflow = 'auto';
    };

    handleScrollBar();
    window.addEventListener('resize', handleScrollBar);
    return () => window.removeEventListener('resize', handleScrollBar);
  }, []);

  const addToCart = (pizza) => {
    setCart((prevCart) => {
      const existingPizza = prevCart.find((item) => item.name === pizza.name);
      if (existingPizza) {
        return prevCart.map((item) =>
          item.name === pizza.name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...pizza, quantity: 1 }];
    });
  };

  const removeFromCart = (pizzaName) => {
    setCart((prevCart) => prevCart.filter((item) => item.name !== pizzaName));
  };

  const placeOrder = () => {
    if (cart.length > 0) {
      setOrderSuccess(true);
      setCart([]);
      setIsCartOpen(false);
      setTimeout(() => setOrderSuccess(false), 3000);
    } else {
      setAuthMessage('Корзина пуста!');
      setTimeout(() => setAuthMessage(''), 3000);
    }
  };

  return (
    <Router>
      <div className="App">
        <AnimatePresence>
          {orderSuccess && (
            <motion.div
              className="order-success"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              Заказ успешно оформлен!
            </motion.div>
          )}
          {authMessage && (
            <motion.div
              className="order-success"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              {authMessage}
            </motion.div>
          )}
        </AnimatePresence>
        <Header
          cart={cart}
          setIsCartOpen={setIsCartOpen}
          setIsAuthOpen={setIsAuthOpen}
          setAuthMode={setAuthMode}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Hero placeOrder={placeOrder} />} />
            <Route path="/menu" element={<Menu addToCart={addToCart} />} />
            <Route path="/events" element={<Events />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
          <PopularPizza addToCart={addToCart} />
        </main>
        <Footer />
        <AnimatePresence>
          {isCartOpen && (
            <CartModal
              cart={cart}
              removeFromCart={removeFromCart}
              placeOrder={placeOrder}
              setIsCartOpen={setIsCartOpen}
            />
          )}
          {isAuthOpen && (
            <AuthModal
              authMode={authMode}
              setAuthMode={setAuthMode}
              setIsAuthOpen={setIsAuthOpen}
              setAuthMessage={setAuthMessage}
            />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

function Header({ cart, setIsCartOpen, setIsAuthOpen, setAuthMode }) {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="logo">PIZZASHOP</div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/about">About Us</Link></li>
        </ul>
      </nav>
      <div className="buttons">
        <button
          className="login-btn"
          onClick={() => {
            setIsAuthOpen(true);
            setAuthMode('login');
          }}
        >
          Log In
        </button>
        <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
          🛒 {totalItems > 0 && <span className="cart-count">{totalItems}</span>}
        </button>
      </div>
    </header>
  );
}

function Hero({ placeOrder }) {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate('/menu');
  };

  return (
    <motion.section
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="hero-content">
        <motion.h1
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The Fastest Pizza ⚡ Delivery
        </motion.h1>
        <motion.p
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          We will juicy pizza for your family in 30 minutes
        </motion.p>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <button className="order-btn" onClick={placeOrder}>
            Order Now
          </button>
          <button className="menu-btn" onClick={handleMenuClick}>
            Menu
          </button>
        </motion.div>
      </div>
      <motion.div
        className="hero-image"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 120 }}
      >
        <img src="./img/master-pizza-chef.png" alt="Hero Pizza" className="hero-image-pizza" />
      </motion.div>
    </motion.section>
  );
}

function Menu({ addToCart }) {
  const [activeCategory, setActiveCategory] = useState('Show All');

  const filteredItems =
    activeCategory === 'Show All'
      ? menuData
      : menuData.filter((item) => item.category === activeCategory);

  return (
    <section className="menu">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Menu
      </motion.h2>
      <motion.div
        className="menu-tabs"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
      >
        {['Show All', 'Meat', 'Vegetarian', 'Sea products', 'Mushroom', 'Cheese'].map((category) => (
          <button
            key={category}
            className={activeCategory === category ? 'active' : ''}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </motion.div>
      <motion.div
        className="menu-items"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        viewport={{ once: true }}
      >
        <AnimatePresence>
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.name}
              className="menu-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <img src={item.image} alt={item.name} className="menu-item-image" loading="lazy" />
              <h3>{item.name}</h3>
              <p>{item.ingredients}</p>
              <p className="price">{item.price}</p>
              <button onClick={() => addToCart(item)}>Add to Cart</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

function PopularPizza({ addToCart }) {
  const popularItems = [
    { name: 'Argentina', price: '7.35$', ingredients: 'Filing: Argentina, tomato, mushrooms', category: 'Meat', image: './img/argentina-pizza.png' },
    { name: 'Gribaya', price: '6.35$', ingredients: 'Filing: tomato, mushrooms', category: 'Mushroom', image: './img/gribaya-pizza.png' },
    { name: 'Tomato', price: '7.35$', ingredients: 'Filing: tomato, mushrooms', category: 'Vegetarian', image: './img/tomato-pizza.png' },
    { name: 'Italian x2', price: '8.35$', ingredients: 'Filing: Italian, cheese, mushrooms', category: 'Meat', image: './img/italian-x2-pizza.png' },
  ];

  return (
    <section className="popular-pizza">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Most Popular Pizza
      </motion.h2>
      <motion.div
        className="popular-items"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        viewport={{ once: true }}
      >
        {popularItems.map((item, index) => (
          <motion.div
            key={item.name}
            className="popular-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <img src={item.image} alt={item.name} className="popular-item-image" loading="lazy" />
            <h3>{item.name}</h3>
            <p>{item.ingredients}</p>
            <p className="price">{item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function Events() {
  const events = [
    { title: 'Awesome Cooking', image: './img/awesome-cooking-free-pizza-for-everyone.png', description: 'Free pizza for everyone' },
    { title: 'Two Pizza For 1 Price', image: './img/two-pizza-for-1-price-buy-one--get-one-free.png', description: 'Buy one, get one free' },
    { title: 'Free Coffee For 3 Pizzas', image: './img/free-coffee-for-3-pizzas-free-coffee-with-order.png', description: 'Free coffee with order' },
    { title: 'Our Instagram', image: './img/our-instagram-follow-us-on-instagram.png', description: 'Follow us on Instagram' },
    { title: 'Kitchen Tour', image: './img/kitchen-tour-visit-our-kitchen-pizzeria.png', description: 'Visit our kitchen' },
    { title: 'Where Are You List', image: './img/where-are-you-list-check-our-locations-pizzeria.png', description: 'Check our locations' },
  ];

  return (
    <section className="events">
      <motion.h2
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        Events
      </motion.h2>
      <motion.p
        className="events-subtitle"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        viewport={{ once: true }}
      >
        These are regular delicious food at a lower price
      </motion.p>
      <motion.div
        className="events-grid"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        viewport={{ once: true }}
      >
        {events.map((event, index) => (
          <motion.div
            key={event.title}
            className="event-item"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <img src={event.image} alt={event.title} className="event-image" loading="lazy" />
            <h3>{event.title}</h3>
            <p>{event.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function AboutUs() {
  return (
    <motion.section
      className="about-us"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2>About Us</h2>
      <div className="about-content">
        <motion.div
          className="about-text"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p>In about of years we opened 6 outlets, in the future we plan to...</p>
          <p>The kitchen of each point is less that 400-500 meters from...</p>
        </motion.div>
        <motion.div
          className="about-image"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
          viewport={{ once: true }}
        >
          <img src="./img/kitchen-pizza-hall.png" alt="About Us Pizza" className="about-image" loading="lazy" />
        </motion.div>
      </div>
    </motion.section>
  );
}

function CartModal({ cart, removeFromCart, placeOrder, setIsCartOpen }) {
  const totalPrice = cart
    .reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')) * item.quantity, 0)
    .toFixed(2);

  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <h2>Корзина</h2>
        {cart.length === 0 ? (
          <p>Корзина пуста</p>
        ) : (
          <>
            <ul className="cart-items">
              {cart.map((item, index) => (
                <li key={index}>
                  {item.name} - {item.price} x {item.quantity}{' '}
                  <button onClick={() => removeFromCart(item.name)}>Удалить</button>
                </li>
              ))}
            </ul>
            <p>Итого: ${totalPrice}</p>
            <button onClick={placeOrder}>Оформить заказ</button>
          </>
        )}
        <button onClick={() => setIsCartOpen(false)}>Закрыть</button>
      </motion.div>
    </motion.div>
  );
}

function AuthModal({ authMode, setAuthMode, setIsAuthOpen, setAuthMessage }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    if (username && password) {
      setAuthMessage(authMode === 'login' ? 'Вход выполнен!' : 'Регистрация успешна!');
      setTimeout(() => setAuthMessage(''), 3000);
      setIsAuthOpen(false);
      setUsername('');
      setPassword('');
    } else {
      setAuthMessage('Заполните все поля!');
      setTimeout(() => setAuthMessage(''), 3000);
    }
  };

  return (
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <h2>{authMode === 'login' ? 'Вход' : 'Регистрация'}</h2>
        <form onSubmit={handleAuth}>
          <div>
            <label>Имя пользователя:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Пароль:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">{authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
        </form>
        <p>
          {authMode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button
            className="switch-auth-mode"
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
          >
            {authMode === 'login' ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
        <button onClick={() => setIsAuthOpen(false)}>Закрыть</button>
      </motion.div>
    </motion.div>
  );
}

function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="footer-links">
        <div>
          <h4>Sign Up</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">To Order</Link></li>
            <li><Link to="/events">Events</Link></li>
          </ul>
        </div>
        <div>
          <h4>Events</h4>
          <ul>
            <li><a href="#pizza">3 Pizzas Free Coffee</a></li>
            <li><a href="#tour">Kitchen Tour</a></li>
          </ul>
        </div>
        <div>
          <h4>Menu</h4>
          <ul>
            <li><Link to="/menu">Show All</Link></li>
            <li><a href="#vegan">Vegan</a></li>
          </ul>
        </div>
        <div>
          <h4>About Us</h4>
          <ul>
            <li><Link to="/about">Our History</Link></li>
            <li><a href="#why">Why We</a></li>
          </ul>
        </div>
      </div>
      <p>Contact: +7 (897) 335-05-32</p>
    </motion.footer>
  );
}

export default App;