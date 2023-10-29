import React from 'react';
import dumpsterFireLogo from '../../images/dumpsterfire.png';
import './SubFooter.css';

export const LandingFooter = () => {
    return (
        <div className='container footer-holder'>
            <div className='footer-content'>
                <div className='logo'>
                    <a href='#visual'>
                        <img src={dumpsterFireLogo} alt='Dumpster Fire logo' />
                    </a>
                </div>
                <ul className='social-networks'>
                    <li>
                        <a href='https://github.com/cps714-group3'>
                            <i className='icon-github'></i>
                        </a>
                    </li>
                    <li>
                        <a href='https://torontomettool.atlassian.net/jira/software/c/projects/CPMT/boards/1'>
                            <i className='icon-documentation'></i>
                        </a>
                    </li>
                </ul>
                <p className='copyright'>2022 @ CPS714 Section 2 Group 3</p>
            </div>
        </div>
    );
};
