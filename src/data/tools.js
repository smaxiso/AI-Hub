// AI Tools data extracted from bookmarks
import { enhanceTool } from '../utils/toolHelpers.js';

const rawTools = [
  // Chat Tools
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    url: 'https://chat.openai.com/chat',
    category: 'Chat',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABuElEQVR4nHSTSyiFURCA//u7SIlSdl4biZSwICQLYSXZ2RAWZCHPElkoykayYOGSUhbK5mLjUbKxkEeRDVkQKykbb+7vG+bk3Bunvuac+WfmzMyZ33Uilud5PuefxTc38rs/0pmF8Co51sM7rKHbRheLfLXtwgKg9KP8QHZzbIQZiIEguhO1uUAMY3dl/FwrojhncWyActiDCliBfqiGU1jFLtX4+a20a9AtwhRkwxJ0gtw+DPHQAgnQC12SgKvORRwGYR0eIRc2IRlu4AEONasyq3TP1Y1EnoYNiFOnZsiHCSiEY6iFO9FrU0MmgDjdqsyBdAhg0A197M80uzHt0aVe4JgAR9CuPZCnm4SQ87t8pmZokuBQYj5IN+XmHbgGecZMGNIG+jR4nZYkTxgtvSC7NpksaeQzigNIgqBVc4/KBUiBF5DXaoV5U4IZTZmyLSiFAkhUp3uocn5mQJ5SZmSES/e/58CqdUobJSPaAXkwDrGavpQ3KxngfK6Zh8J+DJQZiFFIgycohgG9RNKewymAXRTy07HSD/tB2Mewf0OW6XNJecvodm27sAAmiOgkNeePZdK2dV8AAAD//7sbKMQAAAAGSURBVAMAOya8C3IqFqAAAAAASUVORK5CYII=',
    description: 'Advanced AI chatbot by OpenAI for conversations, coding, analysis, and creative tasks.',
    tags: ['conversation', 'coding', 'analysis', 'writing', 'research'],
    pricing: 'Freemium',
    useCases: ['Content Writing', 'Code Generation', 'Research', 'Problem Solving'],
    addedDate: '2022-11-30',
    isNew: false
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    url: 'https://chat.deepseek.com/',
    category: 'Chat',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAClklEQVR4nIRTS2gUQRB91fPZ7MQEctGoqHhRiCDEEBS9REQ0WTz4iV4CYkDyFbxFvOhBUTzpQRMTBCF4cdWDJmLEzyIKXhLEg6A3CSIiEo1hP9PTXdZMXHcDig1Nd9FdVe/Vq1L452Jqa2M3Pst25V5Z6s/tLKulT8S5HEXxWbaTXf6XnExLIjZ1sr+uETXmO4yTRqPrYr8xyD28julMH7ZEERqmxuhJtc9viMSZAR5yCN3MWO7UcVHe6h2fgjCPliQz8dZgGc509HI/e5hwDFoF0rYEQabPXEwFakgXY7SEGJe1DMchbS1e5X/ikB/otelab0YXkZckszW12FhY4Cy19+odvu++TMjEjsLaMkcQf9k2FZATFvG2NI/tXh1OCq1zcdLI4IXmQperlDpqIjyGxR0h00yKD7gerTAhGyhSxQJ/dF3a7Nfzc0R8i5ViQXVq8hpdSlQgpg3W2kcTIzQ2OUz9WlOzDnFTeeQoVzAw50olZJRCk5dWlwU+6wiLhexkR4mQP0jRrriYsQpTo/RZoh+zGjeElpI6dJEjiCO6ojxEQm+2NIcPSYAsGdGSnipF7bu7sfJdlkIkzQM8+IqeSPMb5ZIjxbgvKgwIHpeZ7+aytFBuKiGEcTm/pQMeTaJK8+zt59Y2IF0I6Yg10IIw5SiqL+UxY0J1vtJYEkB4z0UWJ/yAMvsGeTym4bA92LAar32CCUO0E3HRTcX6IschStUtTeVG6ujhXjfFw5JxXqAu1AS0ShTQQu+qjXiNUKmV3+tFsdNSo3viF9O3VYNCvOc4b/I8DIqx04JDgf5Fgr3PG1x4NkKfYnRJnaonpnJdjLgoz22npaFTTY+Sxn9W1QTGzqw6RVtkD5uyc2L/ZYzL6xcAAAD//+1hzFwAAAAGSURBVAMA3lgxouzDH7oAAAAASUVORK5CYII=',
    description: 'Advanced AI assistant focused on deep reasoning, coding, and complex problem-solving tasks with enhanced mathematical capabilities.'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    url: 'https://gemini.google.com/',
    category: 'Chat',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACh0lEQVR4nIxSS08TURQ+9zGPtrQUFEFajAswoTERU5PSjYHEhZCYuID+AGOa+GLhjkiwwTVsjCb8A6QxcaMkbmAl1HdADaa4QEoqkAJtp512Zu5cZ1ofKAU9m3vul/N995xzPwqHhBIKNdtnXSKxcVANrgXyHzh2yXewp27YzqcBSK1adIAAgrBfLroDyR1XM3B6tKMtPlGyYP7PDngQBEuV5z2d18Hd5Ns81uWb84Wv2eRodFI4tAMeA4piYGQu9XRjT+vzVUe7c6nxHCy7TxdW6JELj4brX/XEOJ2LIeMPgZ9EO89eDXUbDl885Qj43wtn2Qe5E76KJ8kOEteymhlJjIgLFaYlBJbQrw74IIhqd/vNgt40lpICrjcozJZZkHwxTkDGdDIdy0TnoJjcHH1bxg8sslbpQHkKLZQ23AZNvmwyZ8cya+Hv9KC5VDpPVtUunik0Q1GTEAPKACGMRUCmDknOzCcG4HGKiBMxCXl1jygoThdsKAKk8ias51TI6gXQiA4cSdWv4RxZFzsXMMJeUwNEXReLaYBiNJkMSaqxc4N75TFZLLmwvsm4ukWAegETiQEXiGlyBcrmaP4bfrhyH5XtEWhl/mkgqGPGBiaefep70eguxFv1LX+utM40rd56up5gTV9Ti0JkcQRXlzjICcQRq/gARYDZ5+xsD+0PzCyQsjbgduzmJE8KjLo0cGc6j2lmYHEELVS2b4dF3mek3t45IzoZFK6ceZxIq8o95tkmqnuD5OjHu/NDx1/C5GsB9nhgn5F+OwpQODUoFz83JHdVL1sl/lPQd8ta2X9YuRIRwPNtcXXN0KdyQmYK+ofKEEE1a2lNgXh1J9ugj1uvsr3Y3/EdAAD//429n5gAAAAGSURBVAMApnISZcw7dI0AAAAASUVORK5CYII=',
    description: 'Google\'s advanced AI chatbot powered by Gemini, offering multimodal capabilities for conversations, analysis, and creative tasks.'
  },
  {
    id: 'you-com',
    name: 'You.com',
    url: 'https://you.com/?chatMode=default',
    category: 'Chat',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACz0lEQVQ4jW2TzWucZRTFf/d5nnlmJpl8Tk2L7VKMEOumK0X/AqFgcXQjbSk1TaEG6qorqXtpMdavVGJBEGR2/gN1Vd24ikIt4qYhJjExzOTNZN533udeF5Nqiz2ry+VwD+ccrgCASauFa7clAbQWHh73oX5N1Z3DQLx+o6o325/N/A7Qapl/xBUwB6IApy9uHh2pxXknzIurn6jFHiD0ixqq/b9N7YtePlj6/qujm0Ph604A3ji71qyOj74n2KVKHD9m2uOvnTwtXmg4gKWVTJ+Zrnjxo5SD3rqafpQ212+323NZaF3aeTlW49ehUp8dFBlF0SmDw5mJC144hFdNllI3OQnPxti4UR47sfD25Z1zwQe77XyczfudQoSAiTfAe6UaTQCcwxABw5uVWuSdVIljz5vuLwcRN1cO9tR7iYKYAQf9JEemhBdnK4jATNNJdy8xUvcGIiDBUqY+yMkAZqq43Y6ZmeGdycwRx5Xzo0xPegCunG+wtLLH9m6SlMREYBg+Jm9d3tGxUeTN10dMBKnX4KUXIpMTDlVjaEHY7SRW75cc9A3nxMxMRMQcT4Fh/9sJ8jQqwXvIesbHK/uYYcGbNKeExQtjnDoZAfh5NefWnX22tpWk/1rADAIgzok2p0QONSzbT3LrTsaNDyYwg6WVjKxnTE36YS2YgCjinFOT1VBpuJS0TGpWKtTr3rZ21FbvD/jltwHbu2b1mreUIKlZmSjEN1xZpl8davNl2X8QqxMVkeDAEmaoIv0c6+eYqiCYIZZEvKvWJmMq8weplHfdd583f/pzY+1UUWTvA+sxjgfnvGAkkWHrZqbiKi7GiWCmG3ne/fCg032l/WXzxwDX3Q/tuQy4efriH9/WNC1WK27Bx5FpO3RciaMe8rWi6Cz3+uXyf8/0WIutlvlH8zvXtp579czmp3fv5d2794rua2c2Pjl79eHxJ7nD6/8AoLJvNWaWqFYAAAAASUVORK5CYII=',
    description: 'AI-powered search engine and chatbot that provides real-time web results and conversational answers to your queries.'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    url: 'https://www.perplexity.ai/?login-source=floatingSignup',
    category: 'Chat',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACUElEQVQ4jJRTMWhaURQ9+TGQBCK62AiiImrVBseasVEzlIY6Nk1TlIwlU5KhWSqFFBtCCIQuqU07mAabTtqhoyAI6SSI1sEO1QqKDqYKFqP+3/duVLTt0By4/7/37rn33XveewKAKLM2M+maxmOiY+xzyWyCGaanpzE+Po5Go8Gn0Gg09C8Wi/SfmZlBt9tFs9lED22hH8xhsdzEwcE+TCYjzRcX3WQcRqORfJwzhAlheCaTTcBgMGBzcwPz8w5WjUAVORwObG1tkI9zRmL6A0EQWAtTSCaTODl5j9XVR9DpdOSzWi04OnpNa5zDuaIoko9rIMlkMmxvP8Xc3C3I5XJks1moVCp4PB4iRSIRVCoVlsiKer2OdDqDQOAlOp3OVQW8TK1Wi8PDV8jlclAoFFhb8zFiGmNsi2q1iuPjd5TEbDbD5/NSzCABydm+RKlUgiSJ8Hofs0TfUCj86PnaWF9/gr29feJw7qD1/kAUJczO3oDf/wyZzFe241u0Wi2yYPANEokEdncD0Ov1g/5HEkxOTmJp6R7JEg5/oDWlUsFMSePT0zDK5TLcbhfjTo2eAu8lHo9jYeEOE6nB2pCYgPexsvKQSFyXaPQTXSK1Wo1YLEYxg1PoZ3M4bmN5+QFrIQO73Y6Li5/k5qKmUinYbDacnX3E+fmXv1u40kGE0+kkpf3+58jnvzPL09hkMsPlco30P2ihj2bzF0KhELs0QXoPUq+2Wq2GnZ0XdJycM4yRx8QvVF8TDn43OAqFAv7lZ2jzBPw53/2zmv8Az/L5NwAAAP//oE7mDQAAAAZJREFUAwCNjvrsBRWUZgAAAABJRU5ErkJggg==',
    description: 'AI-powered research assistant that combines search and chat to provide accurate, cited answers from the web.'
  },
  {
    id: 'claude',
    name: 'Claude',
    url: 'https://claude.ai/onboarding?returnTo=%2F%3F',
    category: 'Chat',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACYElEQVQ4jY2TzWvUVxiFn3N/k5n4AdoiVpTWD6ymBlRsAlWLmyq4cGHEaRKRblossRsDIRN1EyzUsS24caELVwqJRhEUFP8AQVCRCKnJNCpFqEFKbLEkTpzfPS6cyCSK9uzOe9/7vPfCeWGGSoW2zlJX+7YpP9iTzw51tTXN7JtSqDWPOvKzjI9Y8aTz+QQgea69Urz0vwAfH+ufMJwClg8vT1peVbUC6wHA/UL+k+FC681SoW3P1J0MwL1C26aE2FGpZDodJg6FmP3a8gHDhZK1kOCBh/t3zp8kXAMaUPS0F2TEhNHWJBNvy/XN0RwWbPijq7UFewkwMFmfOw00gM6sKp7rnQb4tNh3J60k68GDcrwSxFLEn1EcslhEdAtmB/D787Tuh9pvq9a4pyeUxu/tQxSBOdVyGcgBKWIjZlJmg6HRIVzRUHf7duEvFBkzPDX8K3k2cARYVsOvVGFZ4C74RproRMZ4KNhLY9D8QFygSBaUM5jpeoq5iLhO8N9Ow5PPfu4b1IwmRrrzK1OHo5hmxGIgqR7dsnQee3OALw0fIHdmakM0Xhd+Ss0+m+MSgHOg9cBiYBn22nRW3L2axkqpPLzqr9zjkdeA8Wy4hag4agtys+ErpKIijxFzgbUS/yQT4fLd9P6udb/1Ds1M4p5nY/OakiStExzOKLYqeo2l0UqMHcAiW2PIZ+uT8sU3orz66NmB7If/zY0Ovba+XVnsHyGoSTDa+Gv/KPCjcHcM2auV6G/eugtJ+YWEv2v4pe/V8tifS3G0OqAPaa+z5WdV4PtVKrR+/+Bg+0fv6nkJeHMA2HVTxIkAAAAASUVORK5CYII=',
    description: 'Anthropic\'s AI assistant designed for helpful, harmless, and honest conversations with advanced reasoning capabilities.'
  },
  {
    id: 'microsoft-copilot',
    name: 'Microsoft Copilot',
    url: 'https://copilot.microsoft.com/',
    category: 'Chat',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACuUlEQVQ4jWWTTWhcZRSGn/N93517ZyYzk5hQFBvjT2NRqlQNCG5EQYSKSxF0I1ixIl25c1GmCILgRhD/guBGheJGWrqwILoq+EMjLlxEK23QysROm07nZu7Pd44bI834rg4PvO/hwHmFafXNwfH/Yfp9A2way86w74vxA43UfYZwt6phZphBvVUy+HwdxtWwlaXPD86sfHVjQABY+Hizc+Xy9pdgi4CZmgBmQPXdJkmhtOfSBddK3gB2BTiAYpS/Whb53rLIrSrG1NXYYjXC6i38n2Nmugkyl1HOt1ZmXzu/NHWCyS3vf/+rE73TiZqTWkTUnETqy8Lk6/Yv6UJzkMy324vd5oMzaXL2sDbe3GP+0iP99k9y3yefPuSc+8FJxElkx+wkMvk7XV07+sKRk0+fbHZuunWtkPbyxJpUllrEidX6Ubi5e+EpTNkxOYniiHgXTVv+gzWwpbR6Ih9tLkfdxmuLaE3UPB57NtyWnX/MYQQiwUULpuIl4tE/3nryxBpAR64dCi6ap5aGFJQ2FjWPQBUOJBsHPIqXSEDFowRRnOhpBDNMhuGdQyFWBJmQWUalDZRgwM9hf7iU/LsRj5KImkPFRE4D5EeOHUyKxt5OUVkaGxSWUUuCElD4JtwV/jrRkPiSJxJQglMw1i8Ou2cAybnySrvTM00UVxZk1cRqdYJ5ojVOiRmSn+Wgj9l8snXvi26YPcPv6TnbqK9fvGB7evfvv6fZ6mFFQIsgVgWsdmDut5nVY8tBBAPOwQT7UL7lau9xxuVKLDFpeNq3CxTb6CSIL4Np7YXagbpVAXO7vurlHysG5Sm7WjO6ZjSWMlx3W1wvx/Vy3NwYP5vjZvONptP3/uvCLg2qt7eu66PD2t2x+HCG60yMyhtpEKm9xdKvS+mfk9ffHe1q47Ssj5tmx4F+H72R/QO6DlIynssC7wAAAABJRU5ErkJggg==',
    description: 'Microsoft\'s AI assistant integrated with Bing, providing intelligent answers, creative content, and web search capabilities.'
  },
  
  // Image Tools
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    url: 'https://stablediffusionweb.com/#demo',
    category: 'Image',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADG0lEQVQ4jU2Ty2ucVRiHf7/3nO+bbyZfmsnQsfXCUJriImqF6qIIqWQR8Va1rsQLEjC6sIuKxCz8C6pbA9qCBemqC4u3TeKiNkLFVIRoEUQNpFBr0s5MzFy+yznndVMwz/55dg8BAFACVAB49Wx7CqKzDHpMgRYAENgIxApVPj0/11jZ7RB3OP7J1doee/ADQ3lTokoUygwaPACAYiBRglDmpWo403V/vffVW48O7sSVT3y4Vrtr/L6LSTo+k/c6gdAQABOCAgBECAG8ghKn45L3OsubnfLE0vy+gQDUZv3u00namMl77UJV0cu9VQSMjtUwuqcKAOjlalUVRa9dJGljplmX0wCVL53557HIxN+RSucCrag889CYHp2ImP69Boli7DQP4cqfmX6zltEFBmtFVamlLx4XAzNn48Q6FzSyyoUnx3R68jf+K5cwtrqMsV8uYfkPj0N7yfefras1oPNBbVyxBmZOhJhSX2juVJ56sMLJeyNuZV1s7azDvHYKOPEG6taj8MD9+yyfniSz3Iv6UoWYEiVarixZicBHWjW9frOD/fFRTLdmEYwBjMWLRyrorP+E9u02jhyoqXVdurKgki0BABLwAdgZDFF4RekKQB2gCqoizzIcPHAPRtIRFKWD+hx+2AE0QKjYoLEqoJ7/oc+1jQG+/HETF6/chEhAAKDXz2HCfI1KpYLV32+x9KLCoH7Y2bBBsRKZeMKI8zd6ET+76lH2B6xXB5g+vBf1NEHSeg4IOS7/ekuXr/VRiRDEVqwf7nxvHjj+7hYVr5OkpSKJI6nWEh0OhhyJPJopcO1GjC9+Vv18dYshiBpjELxTF/QkAeCVs5sfVUebb2e92wUUlqR4X2gYthEbRe6AvAxMYhuowcVpIx72uosX3pk8KYByqxsWsl57OUkbMUkEDU5MDKk2kDkBAdQqxhFAnDbirNf9tuvKBUApAHVpfn9/26+/kPe7ixTjoyS1pNCYmFFtnGIjSlS1EPH5YHtxsD14fmn+4f6uG//f+eWPN49RZJbEFIAWRBDKbCMM2yuB4dyFU4cv73b+A7uzkgfemhxSAAAAAElFTkSuQmCC',
    description: 'Open-source AI image generation model that creates high-quality images from text prompts with fine-grained control.'
  },
  {
    id: 'bing-image-creator',
    name: 'Bing Image Creator',
    url: 'https://www.bing.com/create',
    category: 'Image',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAAXNSR0IArs4c6QAAAaBJREFUOI1tUj1v1EAUnNk93+lyUgKICCrSpuM/IEVUIAoaRJGGkn9Ai/goKUD8B0o6KpCooDiBhKAgOqVIQCRnDp9OubW9byhsy8biNSvt29k382YoCYAkkiaZ4AmS1T1J/Ft1o1cVXkD/OeCqI5oAfEzjk68hmEiYxP/9VQNMAnCY2YMPxZ23IQ0wIQpqqg+ouCbmLkf/fqZvqQ0cARkAEmyZu4Y1AFiBfOnGwRclpwuZ6ElJrCRJHUClroQylAslEY8O4t707PXvtSOtWUN/gnIptTy1c8StHXu3XN2cnbycZ46MjZIOQEIh+xNdFhdnduPC4P5ucn5cPl7O12a+R0mAAFsblrIsDmGbzl072Nh8mqw+hUBRtSWDZksi3Sgpw/HpaGjTo+3nn4tXb/LV99HdI2zRxSjn2TptJhLzXNdf/Pq5jJOdyfy4wAn2rgyf7U+2t7wA7zoACQZ5clri4ZficLa6GOK93Y3bV8eApDpdZOuIIBrkABl+BLs0dp40EwjXyWI7AQQBk1yT0GhyJFi16zS0nncD08tpN+R/AbZHFrIx6N5hAAAAAElFTkSuQmCC',
    description: 'Microsoft\'s AI image generator powered by DALL-E, creating images from text descriptions with creative freedom.'
  },
  {
    id: 'leonardo-ai',
    name: 'Leonardo.ai',
    url: 'https://app.leonardo.ai/ai-generations',
    category: 'Image',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAD30lEQVR4nEyTW0zTdxTHz+///5cWagFLCyswrpYWmJuSidBGGK6DwdC5gbjUmBiMzC2+4MjYw+JlkV1cZC/ExDE3M1GXsUzZw4ZOGFEcMhUnl1pmuZSutNjSCq2l//4vZ0hY4nk+n3O+D98PA6uDCIQQwPrtqHh9G9TJVQsFbpc9TfvcGFmXKnVqJI8GwHmqi1SP+BGWd5eRpxx5Fu44heboBOsH/QO/FcQrlaBMUALPS8DlmgYQfVBWmmv1V+lazCS/Y5VF6igepQhB6Dr24IjT33n+k08PFsgVgnjo/Uo+e+0cm5vhYD/+cAcvMlFiY3Ob3nHOeq596uKRlb+IZCXBL2UfNUzS9tNfe1x8qbEIWlveoy981gQhr5OAXIHqzBioqv8SGhs/F2/038PtRpqpSfhrf/FJ+IautqA2XR240Dt8UyaRxQh1FeX0mZNtRJ2sAPPBRigxN5GxO9Pw+/lWMJoqYfC+TQiGOJJc1GC4VJfRSVVH+ffP/m1R/fPAJ6i1+YzG4iCw4EPTWzthLiwlnMBgxZ5DoAj5waTqIbr8QqYvslYcZhTqQLqpgZHYba92991GJR9NbUlLAffMIrEqVXCirQf0eZtQOcyC8+FdmJe9BDLOBVmGcsL7psho1x94J+mdCso986/eHwjCeFhCUuI04neYifasjVBuTgaG94NMHg3NzbWQkaXCUCiIOdpYUNs81GPfIjgczjwqEhZjBC5C6DVy4pErmcUlFmYHLTAwHoY18QLEMF7ovXodfu0dosI0kvUYJHEYBRwRQOCkEkpOrZllIzyWFurxSawax5cv127QQUl2EagpF6h4CzyhU0jOhldwzuOFF3U8FhYbYCkcIDI2z0MlJGqGSrdsxM3v7hLbRyeBZqegymQk2ewgSKOlsMBKIFUygoaSCrj0MAlD7sv8iUadaDAY+bRYzT0603Sc1uWpa769fk3kLQ6Ks6fiJq0Xbne1Qk6uAZi4WLh6uQ3F6FTK/n2In5qP0Pc9E3yp/rUl/RR7nB6UfTE5qvAVM33d2Tv0L/DuYBHNsTdxYDiK2rtVAjIFB19dpEmQR3xjFihRm8d39IxLd07YbujO5hymwXIsEth2+k8vhW+rfGPxh2Uc+Xl+mgh8/ZLNeo0avOUVbQv7xDA7xNRoykhvpJ+u87icJu/W3cRzwE0vV5pAN5mP2vvDlbF01fo3PYudicPT6/yJXPyINYtyP86gMjQTtGGafbQ51tv+vHhXqPTs2U0sTaOrVq5oQeCpUeUohyvAYULLyz8qFsy36F1JKF2ijPxPM7WzuWeh9YAFWs/IyPi+wP9K/wcAAP//nbPf2QAAAAZJREFUAwAcwM6px3H0hQAAAABJRU5ErkJggg==',
    description: 'Professional AI image generation platform with advanced models, fine-tuning capabilities, and creative tools for artists and designers.'
  },
  
  // Audio Tools
  {
    id: 'pixabay-music',
    name: 'Pixabay Music',
    url: 'https://pixabay.com/music/',
    category: 'Audio',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAACaUlEQVQ4jXWSP0wTcRTH3/td79q7o9eqx79Q/2CBBEpw0UFlMWgwtmXBqTqxNmEiJWFhQidCCB2YSIgmwM5giGAiDDSGYCQ6IJEEKFVpay3Xv3e/ew4lhIS4vc/L+35f8t4XQ4shACAiRCQiAACA/9UA4KgBIgIBIta6Nf3lGgAYIp5PE5FlW0QkMIHb3OTmmRdADYmIEVFtScEsAKAmeWyyjarhdXl1Rec2BwDLtlRRbVQbGTKh43kHAJi22X+7P/Yg9rL7Re/1hz8LvzVJm3oylS1nt1JbPs03+XhSV/SNow3GkJXMUt+tvpH7IyfFkzc7b6vcfP3oFQe+frgevRtt9bYO3RnSVX3p2xICYnAhCACzz2aPT49H10a5zWVRjvfHDdOY2JiIP41z4vVK/cynmeXvy27JzSzb8jg9uqwnjhMI2FTXVDHLiWTCf8WfKWdWfqy0uFuSp8m1/TVFVIiInZ2ZoMqrBbOQLWUJoau+6zB/eNNzc6BjYC+753P7BjsHi2aRIRPaBtsUUQm1h/JmXkDBf9UfCUR6b/TOfZ6LBCJelzf6LiqLcqQ7sv1r++j0yFF7h2mb4fZwuC0MCEbVmE5MN6gNPY09Yx/GcuXc/Jf5gB4Yvjccex87E4iCuPh1cXV/VZXUlJFKF9Od1zo3k5sHfw80p1bl1fGP4811zQyZg4AAQGJSykjtnOx4nB6GTBXV3T+7CCgJkk22yMR8JZ8upZ2C04GERJSr5IhIFVXZIXPiBOQSXABAQIhoky0wQWEKAWFwIciQaZJWtIoVXkHAywm9iI6aQaaUYYwxZOfZvJjQi/gPwjs1dlg2X6AAAAAASUVORK5CYII=',
    description: 'Free royalty-free music library with thousands of tracks for videos, podcasts, and creative projects.'
  },
  {
    id: 'uberduck',
    name: 'Uberduck',
    url: 'https://uberduck.ai/',
    category: 'Audio',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADY0lEQVQ4jV2TW0ybZQCGn+/7/r+0pR1rYWRA3YFYJyJOirpDNsLmnL3BmMVLM2OIeGeIyW48TJPplVtsjMky4kwW8WJLPCxuGTfAsoG6KQvIhsAGbDIth/EDLW3/9j/UC12iPFdv8r7v5SNYQ8/HR2LbdoTavaViv1WwN/v8Go7D3Vy22Df101Jn87uf3PjvXjwMp1rb/fG3tieqo6Vtmi4kRfj93Ax/+nIcaI2CANsqun/dXj3d/dlIx5s/dGYB1MPzy++1XKquqzokdb9A+HGWJH1fD3Pu4hBbGx6lKlKN9JSKsqpw0yMNVXujc+XnLkwMWhIgfiSeqIzWNqNCIMMUVYixs2P0z8ySc1y+PNmPI/7pUGEqo1ub40fiCQB15dPPY08ciJ2Uuk8gvLjCS2He5NfeUZZ9JsKnmJ6cIzmfZfe+HQhZAqqE0lCosaW6/oI69tHRD8qqNz6L9FIUJdwZmqKr/RjROj+vHTtIcEMeaRr09E3jXx+mbns9ReFF6D4hpY5q23nwxIbGhnJUCa6R5fzxr9h1Y5j6gWHShkFoc4pAfpyem34Gr92kfGMNjz1Zz9z3Vxk4dalM7TdKTtiuVCqd49Y33XT1DmDsibLrsIb14BoB8QfLZp7uW2FcAdf7B1HJFfSfRxhP5YLqpchT76duT6lNboFvrw8xk01z9HgrFc89jbdG4hijrAt4mVrQmVny4ArJ3FKWPIqiVI56JRo73Fi/udy1LAbvJ6ndXUM8vgXyBtKjoSKP4294kT27QjwwTCbumQTXhch4/ehKm5SbIhW96azJ2ZExBmaThMIeKKQgb0BhCTeTwl5dwC8yvPNqkMTbEVLmCrliEUPKPm16brHzR2PxjYn0srScIqO3kpCrBHMZshlkLs/Kg/soj45yBLWVJVRWZJianXWfKS3vVN9NDiVbYs9H9LJQU7AsTDotCfh1AppGelmyuioxTUFqVXLX8PFb0sflEZsyW35x5uqZTg0gkJzp0BqbtuWDvmYrb/LLjMZi0YNVsChYDpblUnDBdD24UvHC3q1XchfHO86vlWl4fShxZyHZFtseka5jY9kOtmWTtxyUpiFc3KDlOe2bX+748F+ZBGt4feehmB4JtOcde1/BtrfYtoOm9Hu6EL3hjOpM9Hb9T+e/AeVncuseRij0AAAAAElFTkSuQmCC',
    description: 'AI voice synthesis platform with thousands of voices, including celebrity voices, for text-to-speech and voice cloning.'
  },
  {
    id: 'adobe-enhance',
    name: 'Adobe Enhance Speech',
    url: 'https://podcast.adobe.com/enhance',
    category: 'Audio',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACgUlEQVQ4jV2TT6hVVRjFf+s7+7xzn713xUInT+zPIMk/z9c0RCTBV0LQLJIiiMjJm6sTiQgngiNTsQYh5cRoFCqaNIqoKBJDhB5BkSPrcoVH3bPP2ftrcM59hhs2e2/2Xutb32JtAbxz5MHr1ezs0baNO4AAAC5J3c4dkEu4VCDs96at3//o7PATvbuydrgoyk+FlFJ0AAn9D0jPgzsOuFkwyUgpvmkSxyVTSnX7ECyXoJuO1IElJGE5N6mn/8Bwnklt7aBCQu5yKevvUWbvC4GlxYLxOGPW3XVFVKTUYOLJ0J1d7sruIGXF6BxaLlnaE2hbqGu4dTtRVShnea9K7nhvmHpiNJnA7p2B57YHTp3+l6efKnj7rYr7f034815mMJDczdWJIUzRHYOTEmzbZvzwY8PSnsDh1yo2bRLbnw08NpdYXc2UZVZvrsIU3MkXbZuJ0Xn1lRnm58VwaLg7ZvDywRk+vjchRjDrcP3SPahrZ2HB2LUj8NXXDcdO/MNPPzdIYt/eki2bjUeHTT1wBxkcWi65cbPh+s2GGJ2Ln0XG48zWBeO77xvW1ny9+pTAQbQtPPG4EYK4dbtl49CIsfMlZ7hyLfLllUhVCTCfBmsaW0LAH4ydwQAt7grcudvy/GLgpeWSy19Evvm2YcOGLknuvp7OMGWSUIyuq9dbXz4Q9OL+EnAufx5Z/S0xN2e4P3y7nswjK2u/FEW1M6e6lQh148yU8uFQGo0yKcHsrEhJDtMAeTIrLef2vjmchOwqypCdXM2Yu6PRKBOCGAxESo7k6sFuFgqzQnJ/zy6cmbtUx8kboF8lw7sv6CF0Tebsfd94J9uyyf5omsnK+Q/nz/0HzII7f5sDAgYAAAAASUVORK5CYII=',
    description: 'AI-powered tool that automatically removes background noise and enhances speech quality in audio recordings for podcasts and videos.'
  },
  
  // Video Tools
  {
    id: 'runway',
    name: 'Runway',
    url: 'https://app.runwayml.com/video-tools/teams/sumit749284/ai-tools',
    category: 'Video',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB90lEQVQ4ja2SvW8TQRDFZ+7Wh21Cgo0oHNFRUSAaKBGyUCQKNzT0NHTQUsaIGvp0IJCQDP8A1dGQyhJIkRsEssg5a3G3e3u5L3/t7VCAHYcYpcmrRqP3mx29HYCzVLvdtk7zENExD6428aoQsU1UJ621aTQKAriCiJj/67X+TkUAAKUGN0aZ3MvSUsbs9UGJaf981coOI5YnsZ+Nx+FXIfZvLTN49CphpIZfSo5TmU1mby0bnpmCugjUMYiMCtLlavnhZDwx9Uub10+s7XleJUsFKeE9BgBQknelGLxf9gSBtx1KPiIie95j88K2bSyKwtiMlV3XZWhhXHHK96JwuEtAYyCjL6xvbKVJ8g4RCyJCRDxKtCgKAgA0xkCz2dR/0sYJAYUIeOdi/fJWnqcvp5o9msOLEFfJGFrL07Rbq2+2COHuaDSJANhVrbWZw6sGEACA67rMtq1obaN+OwgGrVqt8SlJxANWclqVc/CGiHD+CwtxzqtpEpDwfz4BAJDy4CPRmNIk0OKXdx8AwB/2n+aZpH6/Xz6xcqfTsZXk3/JM/lCSP59OY1KSv4jU8IOeJaTkwXaWie9K8m67ffwaF0cRBPs3R3n4OQqH0/jQf93r9ZydnW4pjv1XWSooTfw9Ifi1ZWaliMg52ePV/wJLoLVU42n1meg3qvRDjLAT9uAAAAAASUVORK5CYII=',
    description: 'Creative AI suite for video editing, generation, and manipulation with advanced tools for filmmakers and content creators.'
  },
  {
    id: 'd-id-video',
    name: 'D-ID Create Video',
    url: 'https://studio.d-id.com/editor',
    category: 'Video',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACQUlEQVQ4jY2Tv2+NYRTHP+c8z/ve61Z19aP1I6VVKtqIwUJiYpIQk8FixmQQw10a1CiIf0CESEwGEgtJB5GQEIQ21ZpINJS67+37nGPoS278iu90cnLO98l5vt8v/Bvyo/DOuon+NlBBAets+NiWEaw9T7JQIPbm+eTM8E3aDiLgCjSAroqsczkHhmY/teKdF1/LI7emPtTy1tzW0Y0bi7NbDwm4g1DPwnQ906la1Kd54GAHQX8tyj3gkIq8zoNOxSB39/bV+v388KVybGA/gLr7Olu0U8B9Vb0AhIrgY8LHGxk9eZRgyY7mKmvuzxYnmZs9kywe9ub6ugLtNkwUpV1xI1bnBGB1QC4mtAH+oYQHZbLrXXkYkHOf5lR9krhsREVEa9CVZSwXQYECSEApTrBkiEsEVFWXAeXS73pCxaO7ewGeLYLn0gJGs8CAJ966SlsRdccBQ/FkOIBK6PsyX0ypiEgNhIyAeTsE1gV0d4Ae3EuSiQgCCIYEXZK+TXrU6K4fVXe3AlqLi3xGvDslbreSHSvglQgNC5rcPQFuZt/KtKT05JOX1zTqngjECP2o7qqs45Whopuouomr1mv4oKjsC6rTRUps2j54AOxdRFiIUW+4s2BmTaBdyZgQX7DEvCprifrQzGdW1NL4l9NoGeMGkj8G6AXWVo7sRARWVv0+YM3VHWQ/LT4+fNnPbd72axZkKTd/ho8NrSpjPBHdPwO9tJ4dl45A/WnxB+HPGT8/uBrNd/J1YUKak+//9th/4zsQEPjq2M3cXwAAAABJRU5ErkJggg==',
    description: 'Create AI-powered talking avatar videos from text, turning photos into realistic speaking presenters for training, marketing, and content creation.',
    tags: ['video-generation', 'avatars', 'presentations', 'talking-head'],
    pricing: 'Freemium',
    useCases: ['Training Videos', 'Marketing', 'Presentations', 'Content Creation']
  },
  
  // Other Tools
  {
    id: 'agentgpt',
    name: 'AgentGPT',
    url: 'https://agentgpt.reworkd.ai/',
    category: 'Chat',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABJklEQVQ4jaXRv2qUURAF8DPfBiIJIlikVkGMkC5tyhRWFoFUWpiXyHv4ClZWKX2EqKQSUlgqFmkETfxThOz+Unh3/bJu1hUPHJgZ5s7MOTf5T1SSYDApVA3/ecA0+gNnYFRVpi94nGQ7ycckz6vq4m+bUVVlCZtJDpKMtz7EYZLlJH05leQ8yeuqej+5Ak/8wk9c4BQ/MGz5sMfz1vsKt1HBXXzyG3tYwU2szuAuvuNlX88dPMPWAsYHOxjh/lyTUL28a1zCLXzD067XPEA3caxKVWlSqqpGSbr2Q/eSrCT5MO+CG3iBL3iDB62+hneN3ayH46seuYojHOAMJ9hIkj8nXI8uyeck+0nWq+p4bndPwle8xfq0yQutHZvY4kHjwo9rVtzHJczoP+dU4I6/AAAAAElFTkSuQmCC'
  },
  {
    id: 'prompt-engineering',
    name: 'Prompt Engineering',
    url: 'https://www.promptengineering.org/',
    category: 'Other',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADMElEQVQ4jX2TT2xUZRTFz/2+7715M9N2SgcsjIWIaCUqNmhMxBi6gBCNxmjLCIXIQtCIYqkLE40uRg0bo7QTSxCJ8Q8hSosjgaAmQgq6UhINpinYGhTtUDOgFObvm/e+e13gojbGszvJyc09ye8QZimS3nWTFqwCbBsgWkSIlLYgTFrLx/1Pt0/MzNNM46Xf3qxIpZj5m5rvjyI8X0RDUlBqSXhxuk1pvZIlnKoN9e6dfYRi6ezL0XR2w+yPZstLZx+Prc1mACgARADgdQ1sBsTWcs9/0JbeGd29eoTWHV3TbB0njspFhmPIV/4lHMpMA4C3tn+jYhWv5La/S96D/TdSlJ5ToHzZN7bzhov2xL1775x75KVklZ01xIGASBOpMlvZWRke2QEM21j3wKuWzX7tLrs/zSzfE8EEQlcuV73KV4Vb8r9VEsshwSIW6oGoTwCZp2JNT9HNc0/ZsS/HZenq0NFYoaCQoqA+5hrEFzcVdcwNnJH8fBIFAKhUh7d9Vhl+5nAQqBchbLWVe4CMClE/A6gFCiDtUK0y/XObe65rX3Jqw8Eoyp5jiIkgBg+8vgRd/Qu0sZsAaFHyI5Bh/FQvirAxdVYYWHFONi07qe4+vL7wy9UGiiWKkZDdAMppjDe1nAaRAemI+MXTiJhfvccGVtby/g8kYAMmO1pOeo3hqVKDY+txEzi1OoUE0sy2RjZ8WhuRaqDHuGZSynU7xIbNaDXnWQWBcVVQ2D+eWvTOjjO75VCut0DzI62D61UiUnOI5EKxNCePuHsdAnT8sfUj1crjCbCbfOjYw0uPTi68YKzIMVjTI8C3b04sf69cjgo8C4Z+xA/5+jfu+zrSmFBm6xed1b4Td+hUrP33t27f9/l3l+ZtRB0f/gNS/xYCFau5vgOAEECS6BnccmXaa5YX3h+z8UjKZJ5g3VAiW5pzFvU/o06iviTI9e2hayhnKNbd8opoTFSHej/+P5Sj6eyjmtBRGrr8GpCRf40p1r3rSWhpZeaTtTLOArh618JRniq2J/6y3q1K6U6EXKgcfHbPf64RACLrBts1YxWE267VAQASECatUsf9A9vGZ+b/BsksbCLD3sK0AAAAAElFTkSuQmCC'
  },
  {
    id: 'wisdolia',
    name: 'Wisdolia',
    url: 'https://www.wisdolia.com/',
    category: 'Other',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACUElEQVQ4jV2TO2uVSxSGn3cyO9+OikUQJYWXYzjipTABRRGxsBCLKCf+AhE5gq2VjWCjjSiCgiLGX+C90EIR0cpKrbzgQdzHqDlHYatJtsn+5rWYb+9EBwaGxXrWvKz1LrGvdgFxkCSAAAACLH49BlcpyYgEXBb7agYSCMwcJOk3vCoACOdcK2KlDsI8GrsbVregklNSRyLIEaQu2oVsQCH0kFIbpzLHbBF7O0IEEBH5t6rmfB3p2zSxKOiLC+kr6qrFGu+bHyAqt0gQcUU7ASIokLCYabN7eDcn959g1cAfTHyZoF22febqGcYeXyHVAiAiVfcAFESaacEU7Nkywq0Ttxn/f5xrD6/x8u0rWuUP7RzeSZIZezCGFhSI0cKQUOjBUy3WL9/A+b/P0VdbwP2n9/j89QvDg8PsGNrOioGVNL822XpkGy8+vUS1iBjttRTwjxkGl6zm7vE7NP5r8Gb8Hzav28TGPzcC0PjYwJg9x/by/N0ztKjAKRFz00t6U+T0gVNMTk4y0D/A0Joh6rEOwPVHNzh66SjTavFu4i1aVMdlCRIxhB6nb9Ps33VII9tGPJtKYXP47GH6F/fzvfWdG09u8rH5AWIgLKw7laWQnGc5Wpiyzbplaz24dLWmpif96tNr/m02RBsogT6hWIBtZ4sbZbOJv3oTAmZnxCwmVLOpFQQJKZDKdsfHmrNxVhBRnqGKOiqUbWhjJyW7ylOF2tXEXZnPETlg2WWat3+Czi7Z+e2uz/MyZQEhABeRU74yWMj5hzmYX7ye4wYu/gQSIxiYOQbWtQAAAABJRU5ErkJggg=='
  },
  {
    id: 'tome',
    name: 'Tome',
    url: 'https://tome.app/smaxiso',
    category: 'Other',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACP0lEQVQ4jXVSS0pkQRCMrOr3aVwN4hzEVSOu1CuMC3/bmZWDO3ElHmEuoILQN3Ah7hQ8gOAZZGynUaS7supVxizs92gdJqAgySQqMyNSVPVbURS/zOyrmQGAzN7/YM45OOd+p5R+SozxT1EUX1JKBkBIioiAJETe/2ljkgAAEbGiKFxKaSxN0zDnTBGRXq+HGCPlHfMEkISZoaoqNk0jJOmcE9eSc858enpiVVXS6/WQc+5mbpoG3nvUdY3RaISmaSAiYmZECIExRqoqt7a2uL+/z/F4TJJdniRfX195cHDAvb09xhhNVamq5trxnHM4OTlBCAFra2s4OzvDTFScnp5iY2MDo9EIR0dHbfd3wWOMjDEyhMAWNzc3HAwGPD8/53A45PLyMq+vr7t6O3WMkaKqbIUyM5gZ+v0+Qgh4eXmBqmJpaQn9fh/T6RQzCzuB3WeTW+tijFBViAhijB9q83Ai0nWvqgp1XePq6grr6+u4vb3F3d0dVldXcXl5ibquUVUVzAwtD6rKEAJTSnx4eODOzg4HgwEvLi66PYfDIVdWVri5ucn7+3umlBhCoKoSqmozEW13d5eHh4d8e3v7x8bJZMLj42Nub29zOp12wouqmohI0zSYTCZcXFyUnDNijPDeAwByzijLEt57PD8/c2FhAd57IUlJKdHM2lOmqopz7vPtgyRIsigKyTmDJL334kiOy7IUAJZS+kBuhZqLJedMAFaWpZjZ2JH8QfJxRrTWqnnL5nIEwNkdPDrnvv8FXKLjBDYRAyMAAAAASUVORK5CYII='
  },
  {
    id: 'pdfgear',
    name: 'PDFgear Chat',
    url: 'https://www.pdfgear.com/chat-pdf/',
    category: 'Other',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACsklEQVQ4jV2TzWtdVRTFf+u8+17eywsxiYkxr6am1YhiLA60Ayuo1Ik48QP/AidFUAcFBWdSU0cOHDkQ/wBBGwTBdlp0InZQB6ZqCsV+QEgxNDF59917zlkObrDFDYu1Ye+19mRteeX51+mEz8n5EE3pfwwYkJvWJgha7eu0OC0/feImaEBOGaF7dDoQ3nWxIQSI0cQUqOrNghwHmAwI/ye45zp3DUMwwz2YnBTHn8kMFuYDOWdsNQCchW3b2LlBMzBlKWZm4N1TohXE0mEHcg7kLGINKTYmsZZiRIBSRqMR5CTKEk69LS7+BL2uOPedAjmZVNv9HnTa9t4u7nVxt4P/2cUBPDeLbfz4Mty+bRctmJ42w6ELV5U4NMDvvYN3dqSff8EnX0LdLv52DY4egeVH4etv0F/XyZd/lV4+iS/+KG9cJcS6InbHcEpYkI8/S75xg3jmU/zqK/ihQzAckvf3iRtXyXt7pDt3iOcvkHOiqOqKUJW0H5ij+mINtrbofPQhfiuSrl2Dfp+0foW88SdaWqT9xmtUn5wFMuSE/n7wsJm6jzA3R750CebnKV58AfrjxO9/IBw9Ql7/DfUnGPvgNGn9CtWXX6HZWRwj2lxYzE4Jx6gwPu4co9jdhZRhehpvb1OsrNB68gnGTjzH3sdnnGNUCME2FKO6xkIqCrscSpI90Rch4N0d2k+tEKcmaT/2CPvnL3h/a0vF9JRzXQugqFKNmpBKHLDkXI1ULAxIE+MUc7OkZG+vnVMxc7/L0UihybmLWNfKkNWEncZEIgRaDy+Sez2KY8fYXF2VxntOo/JgBwcIRV1Xmy0xP0IZLBRwWbqzvKzW0hLZ5tbZVRgOTbsNjgDuoBDtW7pM683QCp9V8mJuHlfkjPp9tRcGlH/8jiRUtC0nsCzBmHUzUb//L0wueYLWMCvXAAAAAElFTkSuQmCC'
  },
  {
    id: 'simplified',
    name: 'Simplified',
    url: 'https://app.simplified.com/home',
    category: 'Other',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABl0lEQVQ4jbWTvUtbYRTGf/dLY27JB4lJbbENClUMiiAaoVTExaHUCm5OXUt3B1HwH6iLLfi1tjiICEJANwedHYUW2lS9aZDSqo25vSb3OIiizQ0GwQPP9J7zvM9zPhTAATTuGApQAtS7ElQsVBSIB2sImfqtJCVA/sdgZ1h2prtkZSwpYVMve7+EJ/1gZ5jZt89IPPKjaSq+GhXyVVq4Km6oY+9ngcnP3/h1ckatoWJoSrnV600M+DXSEx08bw+RyRaYX7dINprUBw1+/y0yt2GxvXuMfeZ6K9A1lYCpsZ8rMLdu8ao7wujAQ1KtATKHNqMv4iRivsoWVAUyOZuFjSzDPVF624L8OXaYWTug5bGfl92RC82VCPJ2iQ9pi47EAxqjtXzdO+Vj2iL5xM9QKoqI4Lpyg+DGFAqOy9buEV+yp7gCsaDB+MhTXqciFIsunzZz/Dj8V9ZIzz0wdEUW37WIrPaLs9wn7980i+nTqtsDAF1ViAUMHMdlJn3A1NJ38nbJM9dTASBNcZ8MtIc8f77E/R1TtXEOKhqjggm83HoAAAAASUVORK5CYII='
  },
  {
    id: 'chat-d-id',
    name: 'Chat D-ID',
    url: 'https://chat.d-id.com/',
    category: 'Chat',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACQklEQVQ4jY1TS09TURD+Zs65jxbsA28LvYgSBSUkGBFiQNy6Mf4fNsboyj+gK8PSf+DK15aEhIS4YAOGhJDSeklTgd7etveccdGSYFKVL5lkMicz3zy+o3BFBMFi6HmTnCTHnctxvuTTwIZCxCf26F5QWXk47F3/pwECpn0AKFQWb5XD5bULcgqnnnyA2BMhTm23+7Ze3zoAgOvh6pyn3afVw72NcGp6A0ADYEpM541JreuK4Sja2WMwbp9DXlsjW8p3XwwqsyZbgJK5kVIhJ4RcL2mui9ivvuO9+vVz+4fyMkUAigXUOD3abNSr+x8htgxAAFhjJRWRzkh8TQg4i6Ld8+So9gUiAQB007SF0nxGE/XnL5dLowDFpXD5gdLuHZOaGoilBUsFUgoAVFDMisBg/P6IMuIi2m2zWNs/BxetCLRJupFpyw6RMiyWstkWQCQAQMQCCKEep6JZAasuE0gAcLvdTIWgG43vtSja3DcGqQVRHLNIn4OS5KxHAAH7nZNjsxdUOvMX57OZjB8SqDvYAWltmYgUspZEoABINpefBasYABVD5B3yljUgwcSNx+vMagGpeQ/A9IWjE7K22Yq6ce4mRidurL1UzLO9Xu8dAHFELVmTfqYgWKo4jlNotah+errZ+FM88w6w2x0bm8mJny9kgJNqdTsGoMbDlWd1c/BtiOKuBD0+ufocAOtLSTKwvyKfXyg6js6I702BrMLgD/wzaUAgQfDornKdOaukqXto1/ThJwD2ih0DwIw3LPobngP1XkOv4noAAAAASUVORK5CYII='
  },
  {
    id: 'promptbase',
    name: 'PromptBase',
    url: 'https://promptbase.com/',
    category: 'Other',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAClElEQVQ4jU3Sv08TcRjH8c/z/d5dS0uhV6FKCwoVTYNFUUEbUCRRFg0xYdFZRycHFxMHN/8IBzUx0UUd1GiMi0bRBJEfKqBGKSiQhgNarr+ud9/HASUuTz5P8hrflEgcYWYi2rwkCAAzwCDa3Op/oDFj62HFFbtCpKSuQbCrXBAZmn8LAKwRMTMAKKU0n54aSFZlMPt9WSvIWH2L4xTnFqc8VcVfRzIcbgYgpLDz5XMX0sPXzhgHOkWoMdDQ2ZMYPNyULnvlucUpQ/MxmAjSNGOCqFRxO9qjVy/1P7wzAuFCp7xnLBeymfHXnYnjv7KzdnlNCo0Z0jTjROS4XnpfLL9SONrX1n5s9/RkpmS7ka60V5TW13EFXsn9lqQB0ARRwal2tUSvn+4NJQKhRO3NJxO5yYVSVSMp67oHYsHW/euVfNFatn4Ymk+a4RgDN072NgT899/PZC37/MU0CxJ7m5Jn+z4/H5n/NrMz2BKta57JvCMSGgAiVEtOo2cMJ9vvTc0+uvV+YSm3QjKXtb21jW1Dp1Z/RTwrQyAAMhJpLiuVWc+fiDfVB2sO7I5a1Yq1uqEL2tEabjyR8jiwki+NvrhdtC0pdRkOx3xSLBSKizn759J6qMbffyrlVMrx1vrBoe6xie9fXo4tfXibnZnWDT8zS9OMg0gpJqLLh1KPp+dsa4M9JgPfPs1/HM10DHVNPHjn5IpCkwCkGWkGsyHF/EYhrOtXurt2bTcX120KyJN9bQcH9jy9O/Lh2ZQ/5GfFBKJEWw8DADHYJ0R/fEdtbc3s6hr5Kbk3mq+6r978KDuuIAIAArUljhCw2ZZiLlZdxWwIAYbjeAIIBAwh/sXH0LY0MwuiOp9BgAIDCPp1BpTi//P+A/vGSXJU2y+7AAAAAElFTkSuQmCC'
  },
  {
    id: 'phcode',
    name: 'PHCode',
    url: 'https://phcode.dev/',
    category: 'Other',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACGUlEQVQ4jZWSTUhUcRTFf/e9Nz5mUsPEMkyL0AIXERQhBFGGKaZt0o0SbaJ20iaoReTCTbRrGW3CUBg/olZl26hoVYgiNCplSkZ+DJoz7+P/boucUrS0s7twzz33nntgm9AkNkA4UHch7KttBdBOrP8j9545b542TGjvqfKtSYpoJ1ZORfvONunzpiAcaHi8Vt352wARFFCAMFnfhiMPI9/YaoJH6/o2KINwFSdTTUdmkeF4xb60W1T1ypKEE/r+mJM/eVQaU16u/7cJqogmsQVUHhD4WWp2FfBCxqa7s2PvI5VMZCXiPTSm/LXmOblChAgwOnhut/F+NKdTb0sJjbq+VpmRhdB8eiOLZWUfSkAVbCBad0K2+3Slm8i7rFiXxNb93vhrYt+XIpZRlkC+gR5MzFiH4i3SMfdOQQRUsj21zbECt00ibZFC1yETQBSDL8NE4xPKsqimVZgjosi1rZqdGUn77XJn8YmCOCK2Yzzz0rKtZ8xnBaNxcSVvep7K4oDrcaNEIcYCx//sZYIyr6ugxPJX19d/ZmH2Rv5QdM1SvYgGdXjmBNHHQupXv2X9MbE650XrKnXEZnQ0JBHvWdkRO+lNLaSKlCMYdM9ermiaoY0B2AQrXfFyvbfr9q1SSmZq6NdjaOYAXweheBv0jZg6zF2tQOcLaQdI/nrn1lCQ3M2TxdycTdCfBFs3SfKWgwB64fh9cAF+AmrM7iX+u6UrAAAAAElFTkSuQmCC'
  },
  {
    id: 'nvidia-canvas',
    name: 'NVIDIA Canvas',
    url: 'https://www.nvidia.com/en-us/studio/canvas/',
    category: 'Image',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABfElEQVQ4jdXSPUjVcRTG8c/5eW/eXgwSIhoFtzAae0GMQATNuRtSBBE0KlRLLUFTCdFaSUTQGzaEWIJDQzWaQy1FBJKDtBiiQnnv/9eSkXjFqaFnPOc83+E8D/+9otHw/EPHWlqNbGZenlddAxh6amu5RXeRdESWM+1BL/Y0AiwuOJrgzD2Viy9dKbWYLGiP7HumLzEv6cQglhpB0tC4jt17vYtQaSo7LbRhX6nkVJF9UpiMMJM4grl1gFKTR5ip192p10wF48KLWs2DHRX3M2NFduPLgg94tg6QuYXO0hYZs5nW3989vPTDdHA8h/62na7ibITH+PkHMNzjLl7V627nbCC4HHTL3uYwFpxI2c1MNei63uOkpB8FJCHPfVNN1CIMp7pqzt5HMhXZgcyTHN5sX7FfMntpwjWFUaS1PcjiwoSBFM7l7GuEkXq2GJQiOSjrRRfKf8fYsEiDz/WVm42ieaOyrQJKjRYfp73etc2hjYyrWln2ebObf69fqWl8p2SII3gAAAAASUVORK5CYII='
  },
  {
    id: 'ask-your-pdf',
    name: 'Ask Your PDF',
    url: 'https://askyourpdf.com/',
    category: 'Other',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACeklEQVQ4jIxTTUhUURQ+59w78+ZHZ8wfDIM2IUmuCle1chVq0cLGVq2kRT8QtKqdQZGrWgRuokUUtOpHTSOi1gW6aGNGSUJBg42jjQ0zz/fuOZ03aqUodeDxuNxzzved73zXgoYMAf3o2pu1iWocfEHYCA+ldr9KPJXML3V3Q1iebDnIBvbVHf3+SBMFFycbMzEwt52TfgIwsCWiDqxfnOCVRbroMz9TiLFsb+EyIoi1TMNO+LQIoIPtgxBLTPjEd3zPsez34mZXcXz3AYH8DClELireoRYMYZ6BzknIgyxyWBOdNpm3FF75Nt6WxKWxpjACIcJga3FE0SFGxZf02EkITvNuiuARRJlTau+tzmgs4WwQ2n70XKOIKSKu/Y1gykhQKpb5UCZNHZo4IiztIpLQhp+Rod3WkAhXDUnFi9PZwOd3OlaHifNXRKxzjG+qfviQyDZlEFsMQgMauC8OrqvkOVoXGrwYilIugPBTZV7VU0zV912A02EqMRc6+FJZlbQQPdfiG6ra7IJkdTO6JXbSHFjOYRWWtWOfimbCgFeQIKWIfa2ezK+EQsw8IwzXaqQBr7b3fvKjEbRe2jBww3/k27xQZrzFDJV0gvY4BmsMPqgvFyZqK9Zm4bphaLtP9flZCflxyoumxVMxi68zyBdwYA2FDME87ByiJhrRMTrTSRpU3qOhH57E3mJpI8GqAYaR3V1Fs38X1nxONEpGCg1JGhCm8/V9C2Mq9Kb5MHpIpa7mHr04Ezo5oYh5a/GFC+Wl9vxIMSjXefkPqA9pO4o1C0dWXp5oPa5M7mBMjmXeLk7jUO0N/TPs7zYTtCzCuWxPYQrXvfE/8QsAAP//PSknggAAAAZJREFUAwA5fCh0bJ9W/gAAAABJRU5ErkJggg=='
  },
  {
    id: 'gamma',
    name: 'Gamma',
    url: 'https://gamma.app/docs/Untitled-pb9o4ohy1eg3fdu?mode=doc',
    category: 'Other',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADE0lEQVQ4jXWTX2iVdRjHP8973nfnnJ2x1WL5p4koFLLqQhFaEdZgoRTTDG1FFwlhFiRpgtBFsUAaWBhFiEReBFLRxKyLrho6KBWyMBW3lq0xncud/fG0nZ2z931/v28XM6kLP1cPfL/Pc/Hl+QIgybiJpFZJh733Q877udS5uThNh+bn48NxrFZuh6QwcXrfeVV0G7xUdU7vSYr+3TNJAVDjxFcZo8MJMgZx6nV9osSVaxMMXx1nfLrktnc+kSnkInPSNxnrfxZaEgBip48kyXkl1cS57oPHtPapPb6u5XnPimc8TRs8De06e/FPJymVpNjpAEAYSw/hecWDK81Wgq2v7g96v/tROG/U5sgU8tQtbWLZokaVq/MBoNjLmdlrZelzqk6HtHDWb9t70NPQ7lm+WRt37Ne3vWc1OFJUJfW3cqik8pVEyc35UJg6rcsGpl8HrurI8ZOBZSM6N63jiw93MTlTZWBolJ/OD3Lh0jArly9h25Y2S7yCBJPEY2ElVXM+NDt9bpD077KskLcXn1tPxYv2F97m3OkLEIUwWWL1hlY6N7fJyWw+xgzuCecc5IFy7EACM2ICvImlS5oYqC9Q19jAjSjkr2KJ8dmY2nyNyYMFEMw5RmcNLVuxTNRmjUqVI0d7KRPw7r6dDPQf5Z23XiaNEyamSgyPTVoMmjdUThgNKz7oy6SsenD1KrdmzQP2y4kz9Bz73srzKZs6HiWKQs73D2OFHC5OdHlknOaVS7AAq3r67Iei1gYBp7I1ZEauFNn7enfw+88XBRi53MK7JQnUhKI4bTv27fK792xhYkoujOxhA+i9rgOFO9hdmUEzM3P68rOvg77eU5ooTpEJQ+68q4FFi++2pvo6v+7Jx9OOp9fUjI2mH6xvjt6wri4FLVsJaxvpydezsTK7EPrsTKwbkyXyhTy5fJYoinyulkxdAxTHOF6dpvNSD+mtFnadUHj/fXR7z85MlqxSMAN5wCCsgWrFVxEf//ZH8GZXm6UsSP/nk8t6JMrwkvNqEywOzDBxzfAnUx98uv1eO/Nf/z+kNdg7APp4JwAAAABJRU5ErkJggg=='
  },
  
  // Additional Popular AI Tools
  {
    id: 'midjourney',
    name: 'Midjourney',
    url: 'https://www.midjourney.com/',
    category: 'Image',
    icon: null,
    description: 'Leading AI art generator creating stunning, highly-detailed images from text descriptions through Discord, popular among artists and designers.',
    tags: ['art', 'image-generation', 'discord', 'creative'],
    pricing: 'Paid',
    useCases: ['Digital Art', 'Concept Art', 'Illustrations', 'Creative Design']
  },
  {
    id: 'dalle',
    name: 'DALL-E',
    url: 'https://openai.com/dall-e-3',
    category: 'Image',
    icon: null,
    description: 'OpenAI\'s advanced image generation model that creates realistic and artistic images from natural language descriptions with high accuracy.',
    tags: ['image-generation', 'openai', 'art', 'creative'],
    pricing: 'Paid',
    useCases: ['Image Generation', 'Creative Content', 'Marketing Assets', 'Concept Visualization']
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    url: 'https://elevenlabs.io/',
    category: 'Audio',
    icon: null,
    description: 'State-of-the-art AI voice synthesis platform with realistic text-to-speech, voice cloning, and multilingual support for content creators.',
    tags: ['voice-synthesis', 'text-to-speech', 'voice-cloning', 'audio'],
    pricing: 'Freemium',
    useCases: ['Voice Over', 'Audiobooks', 'Podcasts', 'Video Narration']
  },
  {
    id: 'suno',
    name: 'Suno',
    url: 'https://www.suno.ai/',
    category: 'Audio',
    icon: null,
    description: 'AI music generation platform that creates complete songs with vocals and instrumentals from text prompts, revolutionizing music creation.',
    tags: ['music-generation', 'songwriting', 'ai-music', 'audio'],
    pricing: 'Freemium',
    useCases: ['Music Creation', 'Songwriting', 'Background Music', 'Audio Production']
  },
  {
    id: 'pika-labs',
    name: 'Pika Labs',
    url: 'https://pika.art/',
    category: 'Video',
    icon: null,
    description: 'AI video generation platform that creates and edits videos from text prompts, enabling easy video creation and manipulation.',
    tags: ['video-generation', 'video-editing', 'ai-video', 'creative'],
    pricing: 'Freemium',
    useCases: ['Video Creation', 'Video Editing', 'Social Media Content', 'Creative Projects']
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    url: 'https://www.synthesia.io/',
    category: 'Video',
    icon: null,
    description: 'Professional AI video creation platform with realistic avatars and voices, perfect for training videos, presentations, and marketing content.',
    tags: ['video-generation', 'avatars', 'presentations', 'training'],
    pricing: 'Paid',
    useCases: ['Training Videos', 'Corporate Communications', 'Marketing', 'Presentations']
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    url: 'https://www.notion.so/product/ai',
    category: 'Chat',
    icon: null,
    description: 'AI writing assistant integrated into Notion workspace, helping with brainstorming, content creation, summarization, and task automation.',
    tags: ['writing', 'productivity', 'workspace', 'note-taking'],
    pricing: 'Paid',
    useCases: ['Writing', 'Note Taking', 'Task Management', 'Content Creation']
  },
  {
    id: 'cursor',
    name: 'Cursor',
    url: 'https://cursor.sh/',
    category: 'Other',
    icon: null,
    description: 'AI-powered code editor built for pair programming with AI, offering intelligent code completion, refactoring, and generation.',
    tags: ['coding', 'development', 'ide', 'programming'],
    pricing: 'Freemium',
    useCases: ['Code Development', 'Programming', 'Software Engineering', 'Code Review']
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    url: 'https://github.com/copilot',
    category: 'Other',
    icon: null,
    description: 'AI pair programmer by GitHub and OpenAI that suggests code completions, entire functions, and helps developers code faster.',
    tags: ['coding', 'development', 'github', 'programming'],
    pricing: 'Paid',
    useCases: ['Code Completion', 'Programming', 'Software Development', 'Code Suggestions']
  },
  {
    id: 'adobe-firefly',
    name: 'Adobe Firefly',
    url: 'https://firefly.adobe.com/',
    category: 'Image',
    icon: null,
    description: 'Adobe\'s creative AI platform for generating images, text effects, and design elements, integrated with Adobe Creative Cloud.',
    tags: ['image-generation', 'adobe', 'design', 'creative'],
    pricing: 'Freemium',
    useCases: ['Graphic Design', 'Marketing Materials', 'Creative Content', 'Digital Art']
  },
  {
    id: 'jasper',
    name: 'Jasper',
    url: 'https://www.jasper.ai/',
    category: 'Other',
    icon: null,
    description: 'AI content creation platform specializing in marketing copy, blog posts, social media content, and business communications.',
    tags: ['writing', 'marketing', 'content-creation', 'copywriting'],
    pricing: 'Paid',
    useCases: ['Marketing Copy', 'Blog Writing', 'Social Media', 'Content Marketing']
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    url: 'https://www.copy.ai/',
    category: 'Other',
    icon: null,
    description: 'AI-powered copywriting tool that generates marketing content, product descriptions, social posts, and creative copy in seconds.',
    tags: ['copywriting', 'marketing', 'content-creation', 'writing'],
    pricing: 'Freemium',
    useCases: ['Copywriting', 'Marketing Content', 'Product Descriptions', 'Social Media']
  },
  {
    id: 'poe',
    name: 'Poe',
    url: 'https://poe.com/',
    category: 'Chat',
    icon: null,
    description: 'Quora\'s AI platform providing access to multiple AI chatbots including GPT-4, Claude, and custom bots in one interface.',
    tags: ['chatbot', 'multi-model', 'conversation', 'ai-access'],
    pricing: 'Freemium',
    useCases: ['Multi-Model Chat', 'AI Comparison', 'Conversations', 'Custom Bots']
  },
  {
    id: 'character-ai',
    name: 'Character.AI',
    url: 'https://character.ai/',
    category: 'Chat',
    icon: null,
    description: 'Conversational AI platform for chatting with AI characters, including historical figures, fictional characters, and custom personalities.',
    tags: ['chatbot', 'roleplay', 'conversation', 'entertainment'],
    pricing: 'Freemium',
    useCases: ['Entertainment', 'Roleplay', 'Learning', 'Creative Writing']
  },
  {
    id: 'hugging-face',
    name: 'Hugging Face',
    url: 'https://huggingface.co/',
    category: 'Other',
    icon: null,
    description: 'Leading AI community platform hosting thousands of pre-trained models, datasets, and tools for machine learning and NLP tasks.',
    tags: ['ml-platform', 'models', 'datasets', 'development'],
    pricing: 'Freemium',
    useCases: ['Model Hosting', 'ML Development', 'Research', 'AI Deployment']
  }
];

// Enhance all tools with default metadata
export const aiTools = rawTools.map(tool => enhanceTool(tool));

// Category colors for visual distinction - Enhanced with more vibrant but subtle colors
export const categoryColors = {
  Chat: '#6BB6FF',      // Vibrant sky blue
  Image: '#A78BFA',     // Rich lavender purple
  Audio: '#34D399',     // Fresh mint green
  Video: '#FB7185',     // Soft coral pink
  Other: '#C084FC'      // Bright purple
};

