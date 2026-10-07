"use client";

import React from "react"

import { useEffect, useState } from "react";

export function FlowerAnimation() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`flower-container ${loaded ? "" : "not-loaded"}`}>
      <div className="night" />
      <div className="flowers">
        {/* Flower 1 */}
        <div className="flower flower--1">
          <div className="flower__leafs flower__leafs--1">
            <div className="flower__leaf flower__leaf--1" />
            <div className="flower__leaf flower__leaf--2" />
            <div className="flower__leaf flower__leaf--3" />
            <div className="flower__leaf flower__leaf--4" />
            <div className="flower__white-circle" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`flower__light flower__light--${i}`} />
            ))}
          </div>
          <div className="flower__line">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i}`} />
            ))}
          </div>
        </div>

        {/* Flower 2 */}
        <div className="flower flower--2">
          <div className="flower__leafs flower__leafs--2">
            <div className="flower__leaf flower__leaf--1" />
            <div className="flower__leaf flower__leaf--2" />
            <div className="flower__leaf flower__leaf--3" />
            <div className="flower__leaf flower__leaf--4" />
            <div className="flower__white-circle" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`flower__light flower__light--${i}`} />
            ))}
          </div>
          <div className="flower__line">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i}`} />
            ))}
          </div>
        </div>

        {/* Flower 3 */}
        <div className="flower flower--3">
          <div className="flower__leafs flower__leafs--3">
            <div className="flower__leaf flower__leaf--1" />
            <div className="flower__leaf flower__leaf--2" />
            <div className="flower__leaf flower__leaf--3" />
            <div className="flower__leaf flower__leaf--4" />
            <div className="flower__white-circle" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`flower__light flower__light--${i}`} />
            ))}
          </div>
          <div className="flower__line">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`flower__line__leaf flower__line__leaf--${i}`} />
            ))}
          </div>
        </div>

        {/* Growing elements */}
        <div className="grow-ans" style={{ "--d": "1.2s" } as React.CSSProperties}>
          <div className="flower__g-long">
            <div className="flower__g-long__top" />
            <div className="flower__g-long__bottom" />
          </div>
        </div>

        {/* Grass 1 */}
        <div className="growing-grass">
          <div className="flower__grass flower__grass--1">
            <div className="flower__grass--top" />
            <div className="flower__grass--bottom" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`flower__grass__leaf flower__grass__leaf--${i}`} />
            ))}
            <div className="flower__grass__overlay" />
          </div>
        </div>

        {/* Grass 2 */}
        <div className="growing-grass">
          <div className="flower__grass flower__grass--2">
            <div className="flower__grass--top" />
            <div className="flower__grass--bottom" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`flower__grass__leaf flower__grass__leaf--${i}`} />
            ))}
            <div className="flower__grass__overlay" />
          </div>
        </div>

        <div className="grow-ans" style={{ "--d": "2.4s" } as React.CSSProperties}>
          <div className="flower__g-right flower__g-right--1">
            <div className="leaf" />
          </div>
        </div>

        <div className="grow-ans" style={{ "--d": "2.8s" } as React.CSSProperties}>
          <div className="flower__g-right flower__g-right--2">
            <div className="leaf" />
          </div>
        </div>

        <div className="grow-ans" style={{ "--d": "2.8s" } as React.CSSProperties}>
          <div className="flower__g-front">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`flower__g-front__leaf-wrapper flower__g-front__leaf-wrapper--${i}`}>
                <div className="flower__g-front__leaf" />
              </div>
            ))}
            <div className="flower__g-front__line" />
          </div>
        </div>

        <div className="grow-ans" style={{ "--d": "3.2s" } as React.CSSProperties}>
          <div className="flower__g-fr">
            <div className="leaf" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={`flower__g-fr__leaf flower__g-fr__leaf--${i}`} />
            ))}
          </div>
        </div>

        {/* Long grass elements */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((g) => (
          <div key={g} className={`long-g long-g--${g}`}>
            {[
              { leaf: 0, d: g === 0 ? "3s" : g === 1 ? "3.6s" : g === 6 ? "4.2s" : g === 7 ? "3s" : "4s" },
              { leaf: 1, d: g === 0 ? "2.2s" : g === 1 ? "3.8s" : g === 6 ? "4.4s" : g === 7 ? "3.2s" : "4.2s" },
              { leaf: 2, d: g === 0 ? "3.4s" : g === 1 ? "4s" : g === 6 ? "4.6s" : g === 7 ? "3.5s" : "3s" },
              { leaf: 3, d: g === 0 ? "3.6s" : g === 1 ? "4.2s" : g === 6 ? "4.8s" : "3.6s" },
            ].map((item) => (
              <div key={item.leaf} className="grow-ans" style={{ "--d": item.d } as React.CSSProperties}>
                <div className={`leaf leaf--${item.leaf}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
