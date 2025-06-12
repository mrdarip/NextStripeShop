import Cart from "../Cart";

export default function Header() {
  return (
    <header>
      <h1>
        <a href="/">
          <img src="/images/logo.png" alt="logo" />
          mkdarip
        </a>
      </h1>
      <Cart />
    </header>
  );
}
