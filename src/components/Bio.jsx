import Image from 'next/image'

export default function Bio() {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <Image
        src="https://avatars0.githubusercontent.com/u/7128101?s=460&v=4"
        alt="Picture of the author"
        height={100}
        width={100}
        className="rounded-full"
      />
      <p>
        <strong>
          <a
            href="https://github.com/dbk91"
            target="_blank"
            rel="noreferrer noopener"
          >
            Dan Kelly
          </a>
        </strong>
        &apos;s personal blog. Musings about React and other fun technology.
      </p>
    </div>
  )
}
