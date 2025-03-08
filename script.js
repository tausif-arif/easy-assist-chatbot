(() => {
    // Get the script tag that loaded this file
    const scriptTag = document.currentScript;

    // Extract API key and ID from script attributes
    const apiKey = scriptTag.getAttribute("api_key");
    const chatbotId = scriptTag.getAttribute("id");

    if (!apiKey || !chatbotId) {
        console.error("Chatbot: Missing api_key or id. Please include them in the script tag.");
        return;
    }

    console.log("apikey", apiKey);
    console.log("chatbotId", chatbotId);

    // Create elements
    const chatbotWidget = document.createElement("div");
    chatbotWidget.id = "chatbot-widget";

    // Chatbot HTML structure
    chatbotWidget.innerHTML = `
      <div id="chatbot-header">
        <span>Chatbot</span>
        <span id="chatbot-close">×</span>
      </div>
      <div id="chatbot-messages"></div>
      <div id="chatbot-input">
        <textarea placeholder="Type your message..."></textarea>
        <button>Send</button>
      </div>
    `;

    // Toggle Button
    const toggleButton = document.createElement("div");
    toggleButton.id = "chatbot-toggle-button";
    toggleButton.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    `;

    // Function to initialize UI and event listeners
    const initChatbot = () => {
        // Add elements to the DOM
        document.body.appendChild(chatbotWidget);
        document.body.appendChild(toggleButton);

        // Avatars
        const userAvatarURL = "https://robohash.org/user-avatar?set=set4";
        const botAvatarURL = "https://robohash.org/bot-avatar";

        // Message handling
        const messagesDiv = chatbotWidget.querySelector("#chatbot-messages");
        const textarea = chatbotWidget.querySelector("textarea");
        const button = chatbotWidget.querySelector("button");

        const addMessage = (content, isBot = false, isTyping = false) => {
            if (isTyping) {
                const typingIndicator = document.createElement("div");
                typingIndicator.className = "typing-indicator";
                typingIndicator.innerHTML = `
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                  <span class="typing-dot"></span>
                `;
                messagesDiv.appendChild(typingIndicator);
                messagesDiv.scrollTop = messagesDiv.scrollHeight;
                return typingIndicator;
            }

            const bubble = document.createElement("div");
            bubble.className = `chat-bubble ${isBot ? "bot" : "user"}`;

            const avatar = document.createElement("div");
            avatar.className = "avatar";
            const img = document.createElement("img");
            img.src = isBot ? botAvatarURL : userAvatarURL;
            avatar.appendChild(img);

            const message = document.createElement("div");
            message.className = "message";
            message.textContent = content;

            bubble.appendChild(avatar);
            bubble.appendChild(message);
            messagesDiv.appendChild(bubble);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            return bubble;
        };

        const sendMessage = async () => {
            const userMessage = textarea.value.trim();
            if (!userMessage) return;

            addMessage(userMessage, false);
            textarea.value = "";

            const typingIndicator = addMessage("", true, true);

            try {
                const response = await fetch("https://fast-api-chatbot-backend-2.onrender.com/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        query: userMessage,
                        smart_agent_id: chatbotId,
                        api_key: apiKey
                    })
                });
                const data = await response.json();
                typingIndicator.remove();
                addMessage(data.bot, true);
            } catch (error) {
                console.error("Chat error:", error);
                typingIndicator.remove();
                addMessage("Error: Unable to contact the chatbot server.", true);
            }
        };

        // Chat toggle
        let isOpen = false;
        const toggleChat = () => {
            isOpen = !isOpen;
            chatbotWidget.classList.toggle('open');
            toggleButton.classList.toggle('hidden');
        };

        const closeButton = chatbotWidget.querySelector("#chatbot-close");
        closeButton.addEventListener('click', toggleChat);
        toggleButton.addEventListener('click', toggleChat);
        button.addEventListener("click", sendMessage);

        textarea.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    };

    // Check if DOM is already loaded
    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        // DOM is already loaded, run the initialization immediately
        initChatbot();
    }
})();