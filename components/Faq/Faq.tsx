'use client'
import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Faq.css';

gsap.registerPlugin(ScrollTrigger);

const phrasesHeading = [
  "Have a question that is not",
  "answered? You can contact us",
  "at avdev.area@gmail.com",
];

// Caractere pentru animația de shuffle (exact ca în Header)
const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];

const Faq = () => {
  const [expandedItems, setExpandedItems] = useState([]);
  const answerRefs = useRef([]);
  const faqTitleRef = useRef(null);
  const faqTitleFirstRef = useRef(null);
  const faqTitleSecondRef = useRef(null);
  const faqTitleThirdRef = useRef(null);
  const testSection = useRef(null);
  const pargRefs = useRef([]);

  const toggleItem = (index) => {
    setExpandedItems((prevExpandedItems) => {
      const newExpandedItems = [...prevExpandedItems];
      if (newExpandedItems.includes(index)) {
        newExpandedItems.splice(newExpandedItems.indexOf(index), 1);
      } else {
        newExpandedItems.push(index);
      }
      return newExpandedItems;
    });
  };

  useEffect(() => {
    answerRefs.current.forEach((content, index) => {
      if (content) {
        if (expandedItems.includes(index)) {
          content.style.height = '0px';
          requestAnimationFrame(() => {
            content.style.height = `${content.scrollHeight}px`;
            content.style.opacity = '1';
          });
        } else {
          content.style.height = '0px';
          content.style.opacity = '0';
        }
      }
    });
  }, [expandedItems]);

  // Funcția applyEffect8Animation (modificată pentru a adăuga un buffer la lățime)
  const applyEffect8Animation = (element, originalText) => {
    if (!element) return;

    // Pregătim elementul
    element.innerHTML = '';
    const spans = [];

    // Creăm câte un span pentru fiecare caracter
    for (let i = 0; i < originalText.length; i++) {
      const span = document.createElement('span');
      span.classList.add('char');

      if (originalText[i] === ' ') {
        span.innerHTML = '&nbsp;';
      } else {
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.textContent = originalText[i];
      }
      element.appendChild(span);
      spans.push(span);
    }

    // Calculăm și setăm lățimea elementului înainte de animație (adăugăm un buffer de 30px)
    requestAnimationFrame(() => {
      element.style.width = (element.offsetWidth + 30) + 'px';
      element.style.display = 'inline-block';

      // Acum animăm fiecare caracter
      spans.forEach((span, i) => {
        if (span.textContent !== '&nbsp;') {
          gsap.fromTo(span,
            { opacity: 0 },
            {
              duration: 0.03,
              opacity: 1,
              delay: (i + 1) * 0.08,
              onStart: () => {
                const shuffleChar = () => {
                  span.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
                };
                const interval = setInterval(shuffleChar, 19);
                setTimeout(() => {
                  clearInterval(interval);
                  span.textContent = originalText[i];
                }, 100);
              }
            }
          );
        }
      });
    });
  };

  useEffect(() => {
    // Animating FAQ title words separately using applyEffect8Animation
    const firstTitle = faqTitleFirstRef.current;
    const secondTitle = faqTitleSecondRef.current;
    const thirdTitle = faqTitleThirdRef.current;

    if (firstTitle) {
      firstTitle.style.whiteSpace = 'nowrap';
      applyEffect8Animation(firstTitle, "Frequently");
    }
    if (secondTitle) {
      secondTitle.style.whiteSpace = 'nowrap';
      applyEffect8Animation(secondTitle, "Asked");
    }
    if (thirdTitle) {
      thirdTitle.style.whiteSpace = 'nowrap';
      applyEffect8Animation(thirdTitle, "Questions");
    }

    // Animating the phrases in the FAQ section
    const animatePhrases = () => {
      pargRefs.current.forEach((el, index) => {
        gsap.fromTo(
          el,
          { y: '-100%', opacity: 0, visibility: 'hidden' },
          {
            y: '0%',
            opacity: 1,
            visibility: 'visible',
            duration: 0.6,
            ease: [0.35, 0.8, 0.35, 0.8],
            delay: 0.15 * index,
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              toggleActions: 'play none none reset',
              onEnter: () => el.classList.remove('invisible'),
            }
          }
        );
      });
    };

    animatePhrases();

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="faq-container py-4" id="Faq" ref={testSection}>
      <div className="md:text-left text-center justify-between w-full gap-16 faq_wrap">
        <div className="faq-text ml-4">
          <div className="faq_title" ref={faqTitleRef}>
            <h1 className="text-left title">
              <div ref={faqTitleFirstRef} className="title-line" style={{ display: 'block' }}></div>
              <div ref={faqTitleSecondRef} className="title-line" style={{ display: 'block' }}></div>
              <div ref={faqTitleThirdRef} className="title-line" style={{ display: 'block' }}></div>
            </h1>
          </div>
          {phrasesHeading.map((phrase, index) => (
            <div ref={(el) => pargRefs.current[index] = el} key={index} className="p-desc invisible">
              <p className="text-left leading-5 mt-2">
                {phrase}
              </p>
            </div>
          ))}
        </div>
        <div className="faq-items flex flex-col mt-8">
          {['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5', 'Question 6'].map((question, index) => (
            <div
              key={index}
              className={`faq-item border_unv notifbrd_gradient2 bg-transparent w-full ${expandedItems.includes(index) ? 'expanded' : ''}`}
              onClick={() => toggleItem(index)}
            >
              <div className="faq-item-content bg-transparent rounded-full stat-btn-faq">
                <h3 className="text-[1.3rem] md:text-[1.5rem]">{question}</h3>
                <div className={`toggle-icon ${expandedItems.includes(index) ? 'open' : ''}`}></div>
              </div>
              <div className={`answer ${expandedItems.includes(index) ? 'open' : ''}`} ref={(el) => (answerRefs.current[index] = el)}>
                <p>{getAnswer(index)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getAnswer = (index) => {
  switch (index) {
    case 0:
      return 'What is the main feature of the SASS scheduling product? Our scheduling product offers real-time updates, automated reminders, and integration with multiple calendars to streamline your scheduling process.';
    case 1:
      return 'How does the product handle time zone differences? The product automatically adjusts for time zone differences and ensures that all meeting times are displayed correctly according to the user\'s local time zone.';
    case 2:
      return 'Can I integrate this scheduling tool with other platforms? Yes, our tool integrates with various platforms including Google Calendar, Microsoft Outlook, and Apple Calendar.';
    case 3:
      return 'Is it possible to customize the scheduling interface? Absolutely! You can customize the interface to match your company\'s branding and user preferences.';
    case 4:
      return 'What security measures are in place to protect my data? We implement industry-standard encryption and secure protocols to protect your data and ensure privacy.';
    case 5:
      return 'How can I contact support if I have issues? You can contact our support team via email at avdev.area@gmail.com or through our in-app chat feature.';
    default:
      return 'No answer available.';
  }
};

export default Faq;