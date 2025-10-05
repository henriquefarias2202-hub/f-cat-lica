import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fé Imperial - Desperte o Poder da Sua Fé | Orações Sagradas dos Grandes Líderes',
  description: 'Descubra os segredos espirituais milenares que grandes líderes da história utilizaram para conquistar impérios, acumular riquezas e alcançar a imortalidade espiritual. Mais de 500 orações sagradas traduzidas do Latim e Aramaico.',
  keywords: [
    'orações poderosas',
    'fé imperial',
    'orações sagradas',
    'manuscritos antigos',
    'orações em latim',
    'transformação espiritual',
    'prosperidade divina',
    'orações dos santos',
    'rituais sagrados',
    'poder da fé',
    'orações milagrosas',
    'espiritualidade cristã'
  ],
  authors: [{ name: 'Fé Imperial' }],
  creator: 'Fé Imperial',
  publisher: 'Fé Imperial',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://feimperial.com',
    siteName: 'Fé Imperial',
    title: 'Fé Imperial - Desperte o Poder da Sua Fé',
    description: 'Descubra os segredos espirituais milenares que grandes líderes da história utilizaram para conquistar impérios. Mais de 500 orações sagradas exclusivas.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fé Imperial - Orações Sagradas dos Grandes Líderes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fé Imperial - Desperte o Poder da Sua Fé',
    description: 'Descubra os segredos espirituais milenares que grandes líderes da história utilizaram para conquistar impérios.',
    images: ['/og-image.jpg'],
    creator: '@feimperial',
  },
  verification: {
    google: 'seu-codigo-google-search-console',
    yandex: 'seu-codigo-yandex',
    yahoo: 'seu-codigo-yahoo',
  },
  alternates: {
    canonical: 'https://feimperial.com',
  },
  category: 'Espiritualidade',
}