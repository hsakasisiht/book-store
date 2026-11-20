import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="brivon-footer">
      <div className="container">
        {/* Editorial Top Headline Quote */}
        <div className="footer-headline-block">
          <span className="eyebrow-tag">
            <span className="eyebrow-dot"></span>
            • BROOKLYN • BERLIN • TOKYO • EST. 2014
          </span>
          <h2 className="footer-big-statement">
            PRINT LIVES IN <span className="lime-highlight">THE WORK,</span> NOT THE SCREEN.
          </h2>
        </div>

        {/* 4-Column Editorial Matrix */}
        <div className="footer-editorial-grid">
          <div className="footer-col brand-col">
            <div className="brivon-mark" aria-hidden="true">
              <span className="aperture-core"></span>
            </div>
            <h3 className="footer-brand-title">BRIVON</h3>
            <p className="footer-bio">
              Independent publisher and curatorial archive of art monographs, brutalist architecture, radical typography, and aesthetic theory.
            </p>
            <div className="footer-city-pills">
              <span className="city-pill">NYC</span>
              <span className="city-pill">BER</span>
              <span className="city-pill">TYO</span>
            </div>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">01 // VOLUMES</h4>
            <ul className="footer-links">
              <li><Link to="/books">Full Archive Index</Link></li>
              <li><Link to="/books?genre=graphic-design">Graphic Design &amp; Grids</Link></li>
              <li><Link to="/books?genre=architecture">Monuments &amp; Spatial</Link></li>
              <li><Link to="/books?genre=photography">Photographic Monograph</Link></li>
              <li><Link to="/books?genre=critical-theory">Critical Aesthetics</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">02 // ARCHIVE SERVICES</h4>
            <ul className="footer-links">
              <li><Link to="/books">Curated Edition Drops</Link></li>
              <li><Link to="/cart">Archival Shipping Bag</Link></li>
              <li><Link to="/orders">Dispatch Status Tracking</Link></li>
              <li><span className="footer-static-item">Acid-Free Conservation Packing</span></li>
              <li><span className="footer-static-item">Priority Worldwide Delivery</span></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">03 // STUDIO DESK</h4>
            <ul className="footer-links">
              <li><Link to="/admin">Internal Operations Desk</Link></li>
              <li><Link to="/login">Reader / Collector Access</Link></li>
              <li><Link to="/register">Create Collector Account</Link></li>
              <li><span className="footer-static-item">Inquiries: desk@brivon.com</span></li>
              <li><span className="footer-static-item">Tel: +1 (212) 555-0194</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} BRIVON EDITIONS &bull; ALL RIGHTS RESERVED &bull; CRAFT OVER NOISE
          </p>
          <div className="footer-subtext-mono">
            35MM • 300GSM MUNKEN PURE • SWISS BINDING
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
