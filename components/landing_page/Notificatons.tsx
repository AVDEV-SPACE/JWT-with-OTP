'use client';
import React, { useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import './Cases.css';
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];

const Notifications = () => {
  const titleRefs = useRef([]);
  const imageRefs = useRef([]);
  const pDescRefs = useRef([]);
  const contentRefs = useRef([]);
  const animatedElements = useRef(new Set());

  const getGradientClass = (index) => {
    switch(index) {
      case 0: return 'notifbrd_gradient2';
      case 1: return 'pending_gradient2';
      case 2: return 'notifbrd_gradient2';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-700';
    }
  };

  const applyShuffleEffect = useCallback((element, originalText) => {
    if (!element || !originalText) return;
    element.innerHTML = '';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    originalText.split('').forEach((char, i) => {
      const span = document.createElement('span');
      span.classList.add('char');
      span.style.opacity = char === ' ' ? '1' : '0';
      span.textContent = char === ' ' ? '\u00A0' : lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
      element.appendChild(span);
      if (char !== ' ') {
        gsap.fromTo(span, { opacity: 0 }, {
          opacity: 1,
          duration: 0.03,
          delay: (i + 1) * 0.06,
          onStart: () => {
            const interval = setInterval(() => {
              span.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
            }, 8);
            setTimeout(() => {
              clearInterval(interval);
              span.textContent = originalText[i];
            }, 300);
          },
        });
      }
    });
  }, []);

  const typewriterEffect = useCallback((element, text, delay = 0) => {
    if (!element || !text) return;
    element.innerHTML = '';
    element.style.visibility = 'visible';
    element.style.opacity = '1';
    text.split('').forEach((char, index) => {
      const span = document.createElement('span');
      span.classList.add('typing-char');
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.verticalAlign = 'top';
      span.textContent = char === ' ' ? '\u00A0' : char;
      element.appendChild(span);
      gsap.to(span, { opacity: 1, duration: 0.05, delay: delay + (index * 0.03), ease: 'none' });
    });
  }, []);

  useEffect(() => {
    contentRefs.current.forEach((container, index) => {
      if (container) {
        const title = titleRefs.current[index];
        const paragraphs = pDescRefs.current.slice(index * 4, index * 4 + 4);

        ScrollTrigger.create({
          trigger: container,
          start: "top 80%",
          onEnter: () => {
            if (!animatedElements.current.has(container)) {
              const tl = gsap.timeline();
              if (title && !animatedElements.current.has(title)) {
                tl.set(title, { visibility: 'visible', opacity: 1 })
                  .add(() => {
                    applyShuffleEffect(title, title.dataset.text || title.textContent);
                    animatedElements.current.add(title);
                  });
              }
              tl.add(() => {
                paragraphs.forEach((pDesc) => {
                  if (pDesc) {
                    const pElement = pDesc.querySelector('p');
                    if (pElement && pElement.textContent && !animatedElements.current.has(pElement)) {
                      typewriterEffect(pElement, pElement.textContent, 0);
                      gsap.to(pElement, { visibility: 'visible', duration: 0.1 });
                      animatedElements.current.add(pElement);
                    }
                  }
                });
              }, '+=0.3');
              animatedElements.current.add(container);
            }
          },
          once: true
        });
      }
    });

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollTop / scrollHeight;
      imageRefs.current.forEach((img, index) => {
        if (img) {
          const moveY = scrollProgress * 50;
          const rotation = scrollProgress * 180 * (index % 2 === 0 ? 1 : -1);
          gsap.to(img, { y: -moveY, rotation: rotation, duration: 0.8, ease: 'power2.out' });
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [applyShuffleEffect, typewriterEffect]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex flex-col md:flex-row gap-4 gap-y-4 w-full notifications">
        {[
          { imgSrc: "/assets/images/3drulment.avif", title: "Schedule", content: ["Easily schedule your daily routine or", "weekly program. Manage your schedule", "with ease and ensure timely.", "appointments Movement seamlessly."] },
          { imgSrc1: "/assets/images/3dcurve.avif", imgSrc2: "/assets/images/3dcircle.avif", title: "Pending", content: ["Monitor pending appointments, send or", "receive notifications efficiently. Stay", "updated on your schedule status.", "Manage your activities with ease."] },
          { imgSrc: "/assets/images/3dcub.avif", title: "Cancel", content: ["Quickly cancel unwanted appointments", "to avoid overloading. Ensure your", "funds remain secure. Maintain full Ascertain", "full control over your financial activities."] },
        ].map((item, index) => (
          <div
            className={`starlight__features-container notif ${getGradientClass(index)} transition-all duration-300 ease-in-out`}
            key={index}
            ref={(el) => (contentRefs.current[index] = el)}
            style={{ border: 'none', boxShadow: 'none' }}
          >
            <div className="card-content relative flex items-center rounded-3xl px-2 py-2">
              {index === 1 ? (
                <Image
                  className="img-card cont_img z-10 absolute object-cover transition-transform"
                  src={item.imgSrc2}
                  height={150}
                  width={150}
                  alt={item.title}
                  ref={(el) => (imageRefs.current[index] = el)}
                />
              ) : (
                <Image
                  className="img-card cont_img z-10 absolute object-cover transition-transform"
                  src={item.imgSrc}
                  height={150}
                  width={170}
                  alt={item.title}
                  ref={(el) => (imageRefs.current[index] = el)}
                />
              )}
            </div>
            <div className="content ml-2 z-10 w-full">
              <h1
                className="cards_tit text-xl font-bold leading-[0.9] text-white"
                ref={(el) => (titleRefs.current[index] = el)}
                data-text={item.title}
              >
                {item.title}
              </h1>
              <div className="mt-2">
                {item.content.map((line, idx) => (
                  <div key={idx} className="p-desc md:text-left leading-[0.9]" ref={(el) => (pDescRefs.current[index * 4 + idx] = el)}>
                    <p className="text-white">{line}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center relative rounded-lg notifbrd_gradient5 h-auto py-3">
        <h1 className="animate-pulse">More to come soon</h1>
      </div>
    </div>
  );
};

export default Notifications;