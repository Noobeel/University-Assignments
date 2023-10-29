import { useSigninCheck } from 'reactfire';
import './Landing.css';
import { LandingFAQ } from '../components/landing/LandingFAQ';
import demo from '../images/demoPage.png';
import demo2 from '../images/dashboard.png';
import demo3 from '../images/reports.png';

export const Landing = () => {
    const { status, data: signInCheckResult } = useSigninCheck();

    return (
        <div id='wrapper'>
            <main id='main'>
                <section className='visual' id='visual'>
                    <div className='textblock'>
                        <div className='text'>
                            <h1>Disaster prevention. Leading software management solution</h1>
                            <p>Your all in one project management tool.</p>
                            {
                                status == 'success' && signInCheckResult.signedIn ? (
                                    <a href='/dashboard' className='btn has-arrow'>
                                        Dashboard <i className='icon-arrow-right1'></i>
                                    </a>
                                ) : (
                                    <a href='/login' className='btn has-arrow'>
                                        Login / Sign up <i className='icon-arrow-right1'></i>
                                    </a>
                                )
                            }
                        </div>
                    </div>
                    <div className='img'>
                        <img src={demo} alt='Kanban Board' />
                    </div>
                    <a href='#features' className='scroll-down down'>
                        <span className='mouse'>
                            <span className='scroll icon-arrow-down'></span>
                        </span>
                        See our features
                    </a>
                </section>

                <section className='three-cols' id='features'>
                    <div className='container'>
                        <div className='col'>
                            <div className='img'>
                                <img src={demo2} alt='Dashboard' />
                            </div>
                            <h2>Beautiful and Intuitive Dashboard</h2>
                            <p>See all the information that is relevant to you at a glance.</p>
                        </div>
                        <div className='col'>
                            <div className='img'>
                                <img src={demo} alt='Kanban Board' />
                            </div>
                            <h2>View Ongoing and Completed Tasks</h2>
                            <p>
                                Sort issues and requirements based on their stage of development.
                                Prioritize tasks and move them around by dragging individual cards.
                            </p>
                        </div>
                        <div className='col'>
                            <div className='img'>
                                <img src={demo3} alt='Reports page' />
                            </div>
                            <h2>Easily Upload and View Important Documents</h2>
                            <p>
                                Stay organized and up to date with necessary documents and reports
                                available at your fingertips.
                            </p>
                        </div>
                    </div>
                </section>
                <section className='two-cols' id='faq'>
                    <div className='container'>
                        <div className='col'>
                            <h2>Accelerate the development of your project now!</h2>
                            <p>
                                Dumpster Fire enables teams to maximize the efficiency and
                                organization of their project. No matter how big or small your team,
                                our wide array of tools will help you and your team thrive.
                            </p>
                            {
                                status == 'success' && signInCheckResult.signedIn ? (
                                    <a href='/dashboard' className='btn has-arrow'>
                                        Dashboard <i className='icon-arrow-right1'></i>
                                    </a>
                                ) : (
                                    <a href='/signup' className='btn has-arrow'>
                                        Sign up today<i className='icon-arrow-right1'></i>
                                    </a>
                                )
                            }
                        </div>
                        <div className='col'>
                            <LandingFAQ />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
