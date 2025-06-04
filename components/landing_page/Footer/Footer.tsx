'use client';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';
import { AiFillSlackCircle } from 'react-icons/ai';
import { BsTwitterX } from 'react-icons/bs';
import { AiFillInstagram } from 'react-icons/ai';
import '../../styles/footer.css'; // Asigură-te că acest fișier există și este corect
import { cn } from '@/lib/utils'; // Asigură-te că această utilitate există
import DotPattern from '@/components/ui/dot-pattern'; // Asigură-te că această componentă există

gsap.registerPlugin(ScrollTrigger);

// Define letters and symbols
const lettersAndSymbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '!', '@', '#', '$', '%', '^', '&', '*', '-', '_', '+', '=', ';', ':', '<', '>', ','];

// Corrected Shuffle effect
const shuffleText = (element, originalText) => {
    if (!element) return;
    element.innerHTML = '';
    const maxIterations = 6;
    const iterationDelay = 20;

    const animateAllLetters = () => {
        for (let i = 0; i < originalText.length; i++) {
            const span = document.createElement('span');
            span.classList.add('title-letter');
            if (originalText[i] === ' ') {
                span.innerHTML = '&nbsp;';
                element.appendChild(span);
                continue;
            }
            span.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
            element.appendChild(span);
            // Corecție: Pasăm originalText[i] în loc de finalChar
            animateLetter(span, originalText[i], maxIterations, i * 20);
        }
    };

    const animateLetter = (span, finalChar, iterations, startDelay = 0) => {
        let currentIteration = 0;
        setTimeout(() => {
            const interval = setInterval(() => {
                span.textContent = lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
                currentIteration++;
                if (currentIteration >= iterations) {
                    clearInterval(interval);
                    span.textContent = finalChar;
                }
            }, iterationDelay);
        }, startDelay);
    };

    animateAllLetters();
};

// Typing effect for elements (like list items) - Copied from Notifications
const typewriterEffect = (element, text, delay = 0) => {
    if (!element || !text) return;

    // Clear existing content
    element.innerHTML = '';

    // Make the container (the span itself) visible - Redundant but safe due to initial hidden state
    element.style.visibility = 'visible';
    element.style.opacity = '1';

    const chars = text.split('');

    chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.classList.add('typing-char');

        Object.assign(span.style, {
            opacity: '0', // Start invisible
            display: 'inline-block',
            verticalAlign: 'top'
        });

        span.textContent = char === ' ' ? '\u00A0' : char;

        element.appendChild(span);

        gsap.to(span, {
            opacity: 1,
            duration: 0.05,
            delay: delay + (index * 0.03), // Staggered delay
            ease: 'none'
        });
    });
};


const AnimatedButtonText = forwardRef(({ text }, ref) => {
    const textRef = useRef(null);
    const originalText = text;

    useImperativeHandle(ref, () => ({
        animate() {
            if (textRef.current) {
                 shuffleText(textRef.current, originalText);
                 setTimeout(() => {
                    textRef.current.innerText = originalText;
                 }, 1500); // Delay should match or exceed shuffle duration
            }
        },
        reset() {
            if (textRef.current) {
                textRef.current.innerText = originalText;
            }
        }
    }));

    return <span ref={textRef}>{originalText}</span>;
});

const AnimatedButton = ({ text, href }) => {
    const textRef1 = useRef(null);
    const textRef2 = useRef(null);

    const handleMouseEnter = () => {
        if (textRef1.current) textRef1.current.animate();
        if (textRef2.current) textRef2.current.animate();
    };

    const handleMouseLeave = () => {
        if (textRef1.current) textRef1.current.reset();
        if (textRef2.current) textRef2.current.reset();
    };

    return (
        <div
            className="animatedButtonFooter"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <a href={href} className="font-bold">
                <AnimatedButtonText ref={textRef1} text={text} />
            </a>
            <a href={href} className="font-bold">
                <AnimatedButtonText ref={textRef2} text={text} />
            </a>
        </div>
    );
};


const Footer = () => {
    const footerRef = useRef(null);
    const wbftfTextRef = useRef(null);
    const titleFtrRef = useRef(null);
    const socialsRef = useRef(null);
    // Use an array to hold refs for each list item <li> container
    const listItemsRef = useRef([]);
    // Store original texts as typewriterEffect clears content
    const listItemTexts = useRef([
        "Features",
        "User Demo",
        "Admin Demo",
        "OTP verification"
    ]);


    useEffect(() => {
        const footerElement = footerRef.current;
        if (!footerElement) return;

        const bottomElement = footerElement?.querySelector('.bottom');
        const wbftfElement = wbftfTextRef.current;
        const titleFtrElement = titleFtrRef.current;
        // Filter out any null or undefined refs
        const listItems = listItemsRef.current.filter(Boolean);


        // Add CSS for the typing characters if not already in global CSS
        // Keeping this style tag for the .typing-char class
        const style = document.createElement('style');
        style.textContent = `
            .typing-char {
                display: inline-block;
                will-change: opacity;
                backface-visibility: hidden;
            }
            /* Removed initial hiding CSS for li/span */
        `;
        document.head.appendChild(style);


        // Initial state for list items (hidden) and social icons ( translateY and opacity 0)
        // Control initial state ONLY with GSAP here for list items
        gsap.set([...listItems, ...(socialsRef.current?.querySelectorAll('.social-icon') || [])], {
             y: 0, // Keep them at y:0 initially if not sliding up
             opacity: 0,
             visibility: 'hidden', // Explicitly hide both list items and social icons initially
             xPercent: 0,
        });


        // Animate list items (the <li> containers) on scroll with TYPING effect on SPAN
         listItems.forEach((item, index) => {
             const spanElement = item.querySelector('span');
             const originalText = listItemTexts.current[index]; // Get original text

             if(spanElement && originalText) {
                 ScrollTrigger.create({
                     trigger: item, // Trigger when the li comes into view
                     start: "top 80%", // Adjust as needed
                     once: true, // Animate only once
                     onEnter: () => {
                         console.log(`ScrollTrigger entered for item ${index}. Trigger:`, item); // Debug log

                         // Make the li container visible immediately
                         gsap.set(item, { visibility: 'visible', opacity: 1 });

                         // Make the span itself visible and start typing
                         // typewriterEffect handles visibility/opacity for the span element itself
                         typewriterEffect(spanElement, originalText);

                         console.log(`Started typing effect for item ${index}`); // Debug log
                     },
                      // Optional: for debugging
                     // markers: true,
                 });
             }
         });


        // Animate social icons on scroll
        if (socialsRef.current) {
            const socialIcons = socialsRef.current.querySelectorAll('.social-icon');
            socialIcons.forEach((icon, index) => {
                gsap.to(icon, {
                    y: 0, // Animates from initial y (0 or set by gsap.set) to 0
                    opacity: 1, // Animates from initial opacity (0) to 1
                    visibility: 'visible', // Make visible during animation
                    xPercent: 0,
                    duration: 0.8,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: footerElement, // Use footer as trigger or individual icon
                        start: 'top bottom-=100px',
                        end: 'bottom center',
                        toggleActions: 'play none none reverse',
                        // markers: true,
                    },
                    delay: index * 0.1,
                });
            });
        }


        // Animate the footer title opacity on scroll
        if (titleFtrElement) {
            // Assuming title is initially visible or handled elsewhere.
            // If it also needs scroll animation from hidden, add initial set and GSAP to here.
             gsap.set(titleFtrElement, { opacity: 0 }); // Ensure hidden initially if needed
             gsap.to(titleFtrElement, {
                opacity: 1,
                duration: 1.2,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: footerElement, // Trigger might need adjustment
                    start: 'top bottom-=50px', // Adjust start as needed
                    toggleActions: 'play none none none'
                }
            });
        } else {
             // If titleFtrElement is not animated by GSAP, ensure it's visible by default CSS
        }


        // Animate "We build for the future." text with shuffle on scroll
        if (wbftfElement) {
            gsap.set(wbftfElement, { opacity: 0 }); // Ensure hidden initially
            gsap.to(wbftfElement, {
                opacity: 1,
                duration: 0.8,
                onStart: () => {
                    shuffleText(wbftfElement, "We build for the future.");
                },
                scrollTrigger: {
                    trigger: footerElement, // Trigger might need adjustment
                    start: 'top bottom-=200px', // Adjust start as needed
                    toggleActions: 'play none none none',
                }
            });
        }


        // Animate the bottom element (if needed)
        if (bottomElement) {
             gsap.set(bottomElement, { opacity: 0, y: 20 }); // Ensure hidden/offset initially
             gsap.to(bottomElement, {
                 opacity: 1,
                 y: 0,
                 xPercent: 0,
                 duration: 1,
                 ease: 'power3.out',
                 scrollTrigger: {
                   trigger: footerElement, // Trigger might need adjustment
                   start: 'top bottom-=100px', // Adjust start as needed
                   toggleActions: 'play none none none',
                 },
             });
        }


        // Cleanup function for ScrollTrigger instances and added style tag
        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
            if (document.head.contains(style)) {
                 document.head.removeChild(style);
            }
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return (
        <footer
            className="footer h-[65vh] relative bottom-0 md:mt-28 mt-12 border-gray-300 overflow-hidden md:px-5 px-2"
            ref={footerRef}
        >
            {/* Dot pattern background */}
            <DotPattern
                width={20}
                height={20}
                cx={1}
                cy={1}
                cr={1}
                className={cn("[mask-image:linear-gradient(to_top_right,black,transparent,transparent)]")}
            />
            {/* Wrapper for footer content */}
            <div className="wrapper flex flex-col gap-y-12">
                {/* Top section: Logo and Newsletter signup */}
                <div className="links flex items-center justify-between w-full">
                    <Link href="/" className="cursor-pointer mt-4">
                        <Image
                            src="/assets/icons/logo-full.svg"
                            width={32}
                            height={162}
                            alt="logo"
                            className="h-9 w-fit"
                        />
                    </Link>
                    {/* Newsletter signup form */}
                    <div className="ml-4 client-email text1-2 Newsletter relative notifbrd_gradient2">
                        <div className="flex items-center md:w-[600px] bg-transparent rounded-md px-2">
                            <input
                                className="outline-none border-none bg-transparent w-full px-4 py-2 text-sm relative text-white rounded-md"
                                type="text"
                                placeholder="Enter your email address"
                                style={{ height: '2.5rem' }}
                            />
                            <div id="adminButton"
                                style={{ height: '1.7rem' }}
                                className="absolute right-1 max-w-32 top-0 bottom-0 my-auto px-2 text-white text-[0.8rem]
                                font-semibold rounded-lg flex items-center justify-center whitespace-nowrap"
                            >
                                <AnimatedButton text="Subscribe" href="" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center section: Socials, Nav links, and "We build for the future" text */}
                <div className="center flex flex-col items-end md:gap-y-0 gap-y-5 md:flex-row md:items-start md:justify-between w-full md:mt-6">
                    {/* Social Icons */}
                    <div className="socials flex flex-row md:flex-col md:space-y-2 w-auto" ref={socialsRef}>
                        <Link href="https://twitter.com" target="_blank">
                            {/* Social icons are initially hidden by the common gsap.set */}
                            <AiFillSlackCircle className="social-icon transform-gpu" />
                        </Link>
                        <Link href="https://slack.com" target="_blank">
                            <BsTwitterX className="social-icon transform-gpu" />
                        </Link>
                        <Link href="https://instagram.com" target="_blank">
                            <AiFillInstagram className="social-icon transform-gpu" />
                        </Link>
                    </div>
                    {/* Navigation Links */}
                    <div className="flex flex-col space-y-4 lg:-ml-12 w-auto">
                        <ul className="list-none list1">
                            {/* These li elements are initially hidden by gsap.set */}
                            {/* The typing animation is triggered by their ScrollTrigger on the span */}
                            <li ref={el => listItemsRef.current[0] = el} className="transform-gpu">
                                <Link href="/">
                                    {/* This span's content is cleared and typed on scroll */}
                                    <span className="text-white hover:underline-slide lowercase">
                                        Features {/* Initial text (will be cleared and typed on scroll) */}
                                    </span>
                                </Link>
                            </li>
                            <li ref={el => listItemsRef.current[1] = el} className="transform-gpu">
                                <Link href="/register" passHref>
                                    <span className="text-white hover:underline-slide lowercase">
                                        User Demo {/* Initial text */}
                                    </span>
                                </Link>
                            </li>
                            <li ref={el => listItemsRef.current[2] = el} className="transform-gpu">
                                <Link href="/?admin=true" passHref>
                                    <span className="text-white hover:underline-slide lowercase">
                                        Admin Demo {/* Initial text */}
                                    </span>
                                </Link>
                            </li>
                            <li ref={el => listItemsRef.current[3] = el} className="transform-gpu">
                                <Link href="/otp" passHref>
                                    <span className="text-white hover:underline-slide lowercase">
                                        OTP verification {/* Initial text */}
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* "We build for the future" text */}
                    <div className="flex flex-col gap-2 wbftf w-[9rem]">
                        <p className="font-light" ref={wbftfTextRef}>We build for the future.</p> {/* Text animated by scroll trigger useEffect */}
                    </div>
                </div>

                {/* Bottom section: Copyright/Title */}
                <div className="flex w-full justify-center mt-8 whitespace-nowrap">
                    <h1 className="title-ftr text-center whitespace-nowrap" ref={titleFtrRef}>Scaleup©</h1> {/* Text animated by scroll trigger useEffect */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;