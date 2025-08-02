import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CursorDesign = () => {
    const observerRef = useRef(null);
    const addedElementsRef = useRef(new Set());

    useEffect(() => {
        let timeout;
        let xscale = 1;
        let yscale = 1;
        let xprev = 0;
        let yprev = 0;
        const cursor = document.querySelector("#miniCircle");

        const circleChaptakaro = () => {
            window.addEventListener("mousemove", function (dets) {
                clearTimeout(timeout);
                const xdiff = dets.clientX - xprev;
                const ydiff = dets.clientY - yprev;

                xscale = gsap.utils.clamp(0.8, 1.2, xdiff);
                yscale = gsap.utils.clamp(0.8, 1.2, ydiff);

                xprev = dets.clientX;
                yprev = dets.clientY;

                circleMouseFollower(xscale, yscale);

                timeout = setTimeout(function () {
                    cursor.style.transform = `translate(${dets.clientX}px,${dets.clientY}px) scale(1, 1)`;
                }, 100);
            });
        };

        const circleMouseFollower = (xscale, yscale) => {
            window.addEventListener("mousemove", function (dets) {
                cursor.style.transform = `translate(${dets.clientX}px,${dets.clientY}px) scale(${xscale}, ${yscale})`;
            });
        };

        const addHoverListeners = () => {
            const mediaElements = document.querySelectorAll("img, video");

            mediaElements.forEach((el) => {
                // Check if we've already added listeners to this element
                if (!addedElementsRef.current.has(el)) {
                    const handleMouseEnter = () => cursor.classList.add("shrink-dot");
                    const handleMouseLeave = () => cursor.classList.remove("shrink-dot");
                    
                    el.addEventListener("mouseenter", handleMouseEnter);
                    el.addEventListener("mouseleave", handleMouseLeave);
                    
                    // Store the element and its handlers for cleanup
                    addedElementsRef.current.add(el);
                    el._cursorHandlers = { handleMouseEnter, handleMouseLeave };
                }
            });
        };

        const removeHoverListeners = (element) => {
            if (element._cursorHandlers) {
                element.removeEventListener("mouseenter", element._cursorHandlers.handleMouseEnter);
                element.removeEventListener("mouseleave", element._cursorHandlers.handleMouseLeave);
                delete element._cursorHandlers;
                addedElementsRef.current.delete(element);
            }
        };

        // Create a MutationObserver to watch for DOM changes
        const setupMutationObserver = () => {
            observerRef.current = new MutationObserver((mutations) => {
                let shouldUpdate = false;
                
                mutations.forEach((mutation) => {
                    // Check for added nodes
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if the added node is an image/video or contains images/videos
                            if (node.matches && node.matches('img, video')) {
                                shouldUpdate = true;
                            } else if (node.querySelectorAll) {
                                const mediaInNode = node.querySelectorAll('img, video');
                                if (mediaInNode.length > 0) {
                                    shouldUpdate = true;
                                }
                            }
                        }
                    });
                    
                    // Check for removed nodes and clean up listeners
                    mutation.removedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches && node.matches('img, video')) {
                                removeHoverListeners(node);
                            } else if (node.querySelectorAll) {
                                const mediaInNode = node.querySelectorAll('img, video');
                                mediaInNode.forEach(removeHoverListeners);
                            }
                        }
                    });
                });
                
                if (shouldUpdate) {
                    // Small delay to ensure DOM is fully updated
                    setTimeout(addHoverListeners, 50);
                }
            });
            
            // Start observing
            observerRef.current.observe(document.body, {
                childList: true,
                subtree: true
            });
        };

        circleChaptakaro();
        circleMouseFollower();
        addHoverListeners();
        setupMutationObserver();

        return () => {
            clearTimeout(timeout);
            
            // Clean up mutation observer
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
            
            // Clean up all hover listeners
            const mediaElements = document.querySelectorAll("img, video");
            mediaElements.forEach(removeHoverListeners);
            addedElementsRef.current.clear();
        };
    }, []);

    return <div id="miniCircle"></div>;
};

export default CursorDesign;
