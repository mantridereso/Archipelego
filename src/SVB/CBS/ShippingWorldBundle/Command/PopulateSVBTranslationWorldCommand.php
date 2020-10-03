<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 24.09.15
 * Time: 12:42
 */
namespace SVB\CBS\ShippingWorldBundle\Command;

use SVB\CBS\ShippingWorldBundle\Model;
use Symfony\Bundle\FrameworkBundle\Command\ContainerAwareCommand;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;


class PopulateSVBTranslationWorldCommand extends ContainerAwareCommand
{

    protected function configure()
    {
        $this
            ->setName('archipelago:svb:populate')
            ->setDescription('populate SVB translation world (archipelago)')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {

        $em = $this->getContainer()->get('neo4j.manager');
        $worldRepository = $em->getRepository('SVB\\CBS\\ShippingWorldBundle\\Model\\World');
        $islandRepository = $em->getRepository('SVB\\CBS\\ShippingWorldBundle\\Model\\Island');
        $villageRepository = $em->getRepository('SVB\\CBS\\ShippingWorldBundle\\Model\\Village');
        $shipRepository = $em->getRepository('SVB\\CBS\\ShippingWorldBundle\\Model\\Ship');
        $transportRepository = $em->getRepository('SVB\\CBS\\ShippingWorldBundle\\Model\\Transport');
        $routeRepository = $em->getRepository('SVB\\CBS\\ShippingWorldBundle\\Model\\Route');

        $worldSVB = new Model\World();
        $worldSVB->setName("svbtranslation");
        $worldSVB->setGestalt(327279);
        $worldSVB->setExtent(1024);

        $islandGermany = new Model\Island();
        $islandGermany->setWorld($worldSVB)->setName("Deutschland")->setExtent(170)->setPositionX(180)->setPositionY(120)->setGestalt(1628403009);

        $islandFrance = new Model\Island();
        $islandFrance->setWorld($worldSVB)->setName("France")->setExtent(130)->setPositionX(560)->setPositionY(360)->setGestalt(-521489527);

        $islandItaly = new Model\Island();
        $islandItaly->setWorld($worldSVB)->setName("Italy")->setExtent(200)->setPositionX(280)->setPositionY(420)->setGestalt(-549448993);

        $islandEngland = new Model\Island();
        $islandEngland->setWorld($worldSVB)->setName("England")->setExtent(190)->setPositionX(460)->setPositionY(100)->setGestalt(1786136742);

        $villageDresden = new Model\Village();
        $villageDresden->setName("Dresden")->setIsland($islandGermany)->setCorner(321645452);

        $villageOsnabrueck = new Model\Village();
        $villageOsnabrueck->setName("Osnabrueck")->setIsland($islandGermany)->setCorner(442452);

        $villageBremen = new Model\Village();
        $villageBremen->setName("Bremen")->setIsland($islandGermany)->setCorner(383);

        $villageHamburg = new Model\Village();
        $villageHamburg->setName("Hamburg")->setIsland($islandGermany)->setCorner(8722828);

        $villageVenezia = new Model\Village();
        $villageVenezia->setName("Venezia")->setIsland($islandItaly)->setCorner(3252);

        $villagePalermo = new Model\Village();
        $villagePalermo->setName("Palermo")->setIsland($islandItaly)->setCorner(7842452);

        $villageMarseilles = new Model\Village();
        $villageMarseilles->setName("Marseilles")->setIsland($islandFrance)->setCorner(383821);

        $villageStrasbourg = new Model\Village();
        $villageStrasbourg->setName("Strasbourg")->setIsland($islandFrance)->setCorner(653859328);

        $villageEdinburgh = new Model\Village();
        $villageEdinburgh->setName("Edinburgh")->setIsland($islandEngland)->setCorner(653859328);

        $villageManchester = new Model\Village();
        $villageManchester->setName("Manchester")->setIsland($islandEngland)->setCorner(1859328);

        $route1 = new Model\Route();
        $route1->setOrigin($villageDresden)->setDestination($villageEdinburgh);
        $transport1 = new Model\Transport();
        $transport1
            ->setDepartureTime(\DateTime::createFromFormat('j-M-Y', '15-Feb-2009'))
            ->setArrivalTime(\DateTime::createFromFormat('j-M-Y', '16-Feb-2009'))
            ->setRoute($route1);
        $shipCaptainHook = new Model\Ship();
        $shipCaptainHook->setName("CaptainHook")->setWorld($worldSVB)->setCurrentTransport($transport1);

        $route2 = new Model\Route();
        $route2->setOrigin($villageVenezia)->setDestination($villageStrasbourg);
        $transport2 = new Model\Transport();
        $transport2
            ->setDepartureTime(\DateTime::createFromFormat('j-M-Y', '19-Feb-2009'))
            ->setArrivalTime(\DateTime::createFromFormat('j-M-Y', '22-Feb-2009'))
            ->setRoute($route2);
        $shipVanelodor = new Model\Ship();
        $shipVanelodor->setName("Vanelodor")->setWorld($worldSVB)->setCurrentTransport($transport2);

        $route3 = new Model\Route();
        $route3->setOrigin($villageManchester)->setDestination($villageBremen);
        $transport3 = new Model\Transport();
        $transport3
            ->setDepartureTime(\DateTime::createFromFormat('j-M-Y', '17-Feb-2009'))
            ->setArrivalTime(\DateTime::createFromFormat('j-M-Y', '18-Feb-2009'))
            ->setRoute($route3);
        $shipArmageddon = new Model\Ship();
        $shipArmageddon->setName("Armageddon")->setWorld($worldSVB)->setCurrentTransport($transport3);


        $em->persist($islandEngland);
        $em->persist($islandGermany);
        $em->persist($islandFrance);
        $em->persist($islandItaly);
        $em->persist($villageDresden);
        $em->persist($villageOsnabrueck);
        $em->persist($villageBremen);
        $em->persist($villageHamburg);
        $em->persist($villageMarseilles);
        $em->persist($villageStrasbourg);
        $em->persist($villagePalermo);
        $em->persist($villageVenezia);
        $em->persist($villageEdinburgh);
        $em->persist($villageManchester);

        $em->persist($route1);
        $em->persist($route2);
        $em->persist($route3);
        $em->persist($transport1);
        $em->persist($transport2);
        $em->persist($transport3);
        $em->persist($shipCaptainHook);
        $em->persist($shipVanelodor);
        $em->persist($shipArmageddon);

        $em->flush();


    }

}