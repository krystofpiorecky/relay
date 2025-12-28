import { Feed } from '@components/Feed';
import { Cookies } from '@components/Cookies';
import { Cache } from '@components/Cache';
import { Titlebar } from '@components/Titlebar';
import './App.css';
import { useState } from 'react';
import { Page } from '@utilities/page';

function App() {
  const [ page, setPage ] = useState<Page>("feed");

  return <>
    <Titlebar
      page={page}
      onPageChange={setPage}
    />
    {page === "feed" && 
      <main>
        <section>
          nav
        </section>
        <Feed />
      </main>
    }
    {page === "cookies" && <Cookies />}
    {page === "cache" && <Cache />}
  </>
}

export default App
