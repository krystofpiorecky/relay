import { Feed } from '@components/Feed';
import { Cookies } from '@components/Cookies';
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
    <main>
      {page === "feed" && 
        <>
          <section>
            nav
          </section>
          <Feed />
        </>
      }
      {page === "cookies" && 
        <Cookies />
      }
    </main>
  </>
}

export default App
