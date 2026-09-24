import { Badge } from "@/components/ui/Badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Project } from "@/lib/schemas";
import Link from "next/link";
import Markdown from "react-markdown";
import Icon from "./Icon";
import ImageWithSkeleton from "./ImageWithSkeleton";

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  const { name, href, description, image, video, tags, links } = project;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        {video ? (
          <div className="flex h-40 w-full items-center justify-center overflow-hidden rounded-md bg-muted">
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain object-center"
            />
          </div>
        ) : image ? (
          <Link href={href || image}>
            <ImageWithSkeleton
              src={image}
              alt={name}
              width={500}
              height={300}
              sizes="(max-width: 640px) calc(100vw - 4rem), 344px"
              quality={75}
              containerClassName="flex h-40 w-full items-center justify-center overflow-hidden rounded-md bg-muted"
              className="h-full w-full object-contain object-center"
            />
          </Link>
        ) : (
          <div className="flex h-40 w-full items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
            In Progress — media coming soon
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle>{name}</CardTitle>
          <Badge variant="secondary" className="shrink-0 px-2 py-0.5 text-[10px]">
            In Progress
          </Badge>
        </div>
        <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
          {description}
        </Markdown>
      </CardContent>
      <CardFooter className="flex h-full flex-col items-start justify-between gap-4">
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.toSorted().map((tag) => (
              <Badge
                key={tag}
                className="px-1 py-0 text-[10px]"
                variant="secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links.toSorted().map((link, idx) => (
              <Link href={link?.href} key={idx} target="_blank">
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  <Icon name={link.icon} className="size-3" />
                  {link.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}