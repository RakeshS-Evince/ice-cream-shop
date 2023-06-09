import React, { useEffect, useMemo, useState } from 'react'
import Container from 'react-bootstrap/Container'
import { Link, Outlet } from 'react-router-dom'
import CartSidebar from './CartSidebar'
import Headers from './Header'
import Sidebar from './Sidebar'
import useRoleCheck from '../hooks/useRoleCheck'
import AdminHeader from './AdminHeader'

function FullLayout() {
    const { isAdmin, isStaff } = useRoleCheck();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => {
        window.addEventListener('resize', () => {
            setWindowWidth(window.innerWidth)
        });
        return () => {
            window.removeEventListener('resize', () => { })
        }
    })
    useMemo(() => {
        try {
            if (windowWidth <= 590) {
                document.getElementById('sidebar').classList.remove('sidebar_wrapper_show')
            } else {
                document.getElementById('sidebar').classList.add('sidebar_wrapper_show')
            }
        } catch (e) { }

    })
    return (
        <>
            <header>
                {!(isAdmin || isStaff) ?
                    <Headers /> : <AdminHeader />}
            </header>
            <main>
                <div id="main">
                    <Container fluid={!(isAdmin || isStaff)} id='layout' style={{ paddingTop: "70px", paddingBottom: "50px" }}>
                        <Outlet />
                    </Container>
                </div>
                {(isAdmin || isStaff) && <Sidebar />}
                <CartSidebar />
            </main>
            {/* {!(isAdmin || isStaff) && <footer className="bg-dark text-center text-white">
                <div className="container">
                    <div className="text-center p-3" >
                        © 2023 Copyright:
                        <Link to='/' className="text-white">icecream-shop.com</Link>
                    </div>
                </div>
            </footer>} */}
        </>
    )
}

export default FullLayout
